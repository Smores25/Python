import type { Express } from "express";
import { createServer, type Server } from "http";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

const GUILD_ID = "961457576342593606";

// Initialize Discord REST client
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

// Staff roles to display (add your specific role IDs here)
const STAFF_ROLE_IDS = [
  "961457576476819547",  // Lazy Fox Owner
  "961467472123404298",  // Server Manager
  "1246621054621978738", // Staff Manager
  "961457576464248901"   // Server Staff
];

/**
 * Recursively fetch all guild members (handling Discord's 1000-member limit)
 * @param after - The last member ID to paginate from
 * @param members - The collected members so far
 * @returns All members in the guild
 */
async function fetchAllMembers(after = "0", members: any[] = []): Promise<any[]> {
  const response = await rest.get(Routes.guildMembers(GUILD_ID), {
    query: new URLSearchParams({ limit: "1000", after }),
  }) as any[];

  members.push(...response);

  if (response.length === 1000) {
    const lastMemberId = response[response.length - 1].user.id;
    return fetchAllMembers(lastMemberId, members);
  }

  return members;
}

/**
 * Get the highest role position for a given member
 * @param member - The member to fetch the highest role position for
 * @param roles - The guild roles
 * @returns The highest role position
 */
function getHighestRolePosition(member: any, roles: any[]): number {
  const memberRoles = member.roles;
  const rolePositions = roles
    .filter(role => memberRoles.includes(role.id))
    .map(role => role.position);
  return Math.max(...rolePositions, 0); // Return the highest role position
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Staff members endpoint
  app.get("/api/discord/staff", async (req, res) => {
    try {
      // Fetch all members recursively
      const [members, roles] = await Promise.all([
        fetchAllMembers(), // Fetch all members in paginated way
        rest.get(Routes.guildRoles(GUILD_ID)) as Promise<any[]>,
      ]);

      console.log("Fetched total members:", members.length);
      console.log("Fetched roles:", roles.map(r => ({ id: r.id, name: r.name })));

      const staffMembers = members
        .filter(member => 
          member.roles.some((roleId: string) => STAFF_ROLE_IDS.includes(roleId))
        )
        .map(member => {
          // Get nickname if exists, otherwise fallback to username
          const username = member.nick || member.user.username;

          // Build the avatar URL (fallback to default avatar)
          const avatarUrl = member.avatar 
            ? `https://cdn.discordapp.com/guilds/${GUILD_ID}/users/${member.user.id}/avatars/${member.avatar}.png`
            : member.user.avatar 
              ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.id) % 5}.png`;

          return {
            id: member.user.id,
            username: username, // Display username or nickname
            avatarUrl: avatarUrl, // Use avatar or default avatar
            roles: member.roles
              .filter((roleId: string) => STAFF_ROLE_IDS.includes(roleId))
              .map((roleId: string) => roles.find(r => r.id === roleId)?.name || '')
              .filter(Boolean),
            highestRolePosition: getHighestRolePosition(member, roles), // Get highest role position
          };
        });

      // Sort members by highest role position (descending order)
      staffMembers.sort((a, b) => b.highestRolePosition - a.highestRolePosition);

      // Remove highestRolePosition field as it's not needed in the response
      staffMembers.forEach(member => delete member.highestRolePosition);

      res.json(staffMembers);
    } catch (error: any) {
      console.error("Discord API Error:", error);
      res.status(500).json({ 
        message: "Failed to fetch staff members",
        error: error.message 
      });
    }
  });

  // Discord messages endpoint
  app.get("/api/discord/messages/:channelId", async (req, res) => {
    try {
      const channelId = req.params.channelId;

      // Fetch messages from Discord
      const messages = await rest.get(
        Routes.channelMessages(channelId)
      ) as any[];

      const messageType = req.query.type as string;

      const formattedMessages = messages
        .filter(msg => {
          // Get message content from either direct content or referenced message
          const messageContent = msg.content || (msg.message_reference && msg.referenced_message?.content) || '';
          const messageAttachments = [...(msg.attachments || []), ...(msg.message_reference ? (msg.referenced_message?.attachments || []) : [])];

          if (!messageType || messageType === 'all') {
            // Skip messages that only contain role pings
            const isOnlyRolePing = messageContent.trim().startsWith('<@&') && messageContent.trim().endsWith('>') && !messageAttachments.length;
            return !isOnlyRolePing;
          }

          const hasAttachments = msg.attachments.some((att: any) => att.content_type?.startsWith('image/'));
          const hasRolePing = msg.content.includes('@');
          const hasOnlyText = !hasAttachments && !msg.content.includes('@');

          switch(messageType) {
            case 'attachments': return hasAttachments;
            case 'pings': return hasRolePing && (msg.content.length > msg.content.trim().length || !msg.content.trim().startsWith('<@&'));
            case 'text': return hasOnlyText;
            default: return true;
          }
        })
        .map(msg => ({
          id: msg.id,
          author: msg.author.username,
          content: msg.content || '',
          referencedMessage: msg.referenced_message?.content || null,
          timestamp: msg.timestamp,
          attachments: [...(msg.attachments || []), ...(msg.message_reference ? (msg.referenced_message?.attachments || []) : [])]
            .filter((att: any) => att.content_type?.startsWith('image/'))
            .map((att: any) => ({
              url: att.url,
              contentType: att.content_type
            }))
        }));

      res.json(formattedMessages);
    } catch (error: any) {
      console.error("Discord API Error:", error);
      res.status(500).json({ 
        message: "Failed to fetch Discord messages",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
