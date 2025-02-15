// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
var GUILD_ID = "961457576342593606";
var rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
var STAFF_ROLE_IDS = [
  "961457576476819547",
  // Lazy Fox Owner
  "961467472123404298",
  // Server Manager
  "1246621054621978738",
  // Staff Manager
  "961457576464248901"
  // Server Staff
];
async function fetchAllMembers(after = "0", members = []) {
  const response = await rest.get(Routes.guildMembers(GUILD_ID), {
    query: new URLSearchParams({ limit: "1000", after })
  });
  members.push(...response);
  if (response.length === 1e3) {
    const lastMemberId = response[response.length - 1].user.id;
    return fetchAllMembers(lastMemberId, members);
  }
  return members;
}
function getHighestRolePosition(member, roles) {
  const memberRoles = member.roles;
  const rolePositions = roles.filter((role) => memberRoles.includes(role.id)).map((role) => role.position);
  return Math.max(...rolePositions, 0);
}
async function registerRoutes(app2) {
  app2.get("/api/discord/staff", async (req, res) => {
    try {
      const [members, roles] = await Promise.all([
        fetchAllMembers(),
        // Fetch all members in paginated way
        rest.get(Routes.guildRoles(GUILD_ID))
      ]);
      console.log("Fetched total members:", members.length);
      console.log("Fetched roles:", roles.map((r) => ({ id: r.id, name: r.name })));
      const staffMembers = members.filter(
        (member) => member.roles.some((roleId) => STAFF_ROLE_IDS.includes(roleId))
      ).map((member) => {
        const username = member.nick || member.user.username;
        const avatarUrl = member.avatar ? `https://cdn.discordapp.com/guilds/${GUILD_ID}/users/${member.user.id}/avatars/${member.avatar}.png` : member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.id) % 5}.png`;
        return {
          id: member.user.id,
          username,
          // Display username or nickname
          avatarUrl,
          // Use avatar or default avatar
          roles: member.roles.filter((roleId) => STAFF_ROLE_IDS.includes(roleId)).map((roleId) => roles.find((r) => r.id === roleId)?.name || "").filter(Boolean),
          highestRolePosition: getHighestRolePosition(member, roles)
          // Get highest role position
        };
      });
      staffMembers.sort((a, b) => b.highestRolePosition - a.highestRolePosition);
      staffMembers.forEach((member) => delete member.highestRolePosition);
      res.json(staffMembers);
    } catch (error) {
      console.error("Discord API Error:", error);
      res.status(500).json({
        message: "Failed to fetch staff members",
        error: error.message
      });
    }
  });
  app2.get("/api/discord/messages/:channelId", async (req, res) => {
    try {
      const channelId = req.params.channelId;
      const messages = await rest.get(
        Routes.channelMessages(channelId)
      );
      const messageType = req.query.type;
      const formattedMessages = messages.filter((msg) => {
        const messageContent = msg.content || msg.message_reference && msg.referenced_message?.content || "";
        const messageAttachments = [...msg.attachments || [], ...msg.message_reference ? msg.referenced_message?.attachments || [] : []];
        if (!messageType || messageType === "all") {
          const isOnlyRolePing = messageContent.trim().startsWith("<@&") && messageContent.trim().endsWith(">") && !messageAttachments.length;
          return !isOnlyRolePing;
        }
        const hasAttachments = msg.attachments.some((att) => att.content_type?.startsWith("image/"));
        const hasRolePing = msg.content.includes("@");
        const hasOnlyText = !hasAttachments && !msg.content.includes("@");
        switch (messageType) {
          case "attachments":
            return hasAttachments;
          case "pings":
            return hasRolePing && (msg.content.length > msg.content.trim().length || !msg.content.trim().startsWith("<@&"));
          case "text":
            return hasOnlyText;
          default:
            return true;
        }
      }).map((msg) => ({
        id: msg.id,
        author: msg.author.username,
        content: msg.content || "",
        referencedMessage: msg.referenced_message?.content || null,
        timestamp: msg.timestamp,
        attachments: [...msg.attachments || [], ...msg.message_reference ? msg.referenced_message?.attachments || [] : []].filter((att) => att.content_type?.startsWith("image/")).map((att) => ({
          url: att.url,
          contentType: att.content_type
        }))
      }));
      res.json(formattedMessages);
    } catch (error) {
      console.error("Discord API Error:", error);
      res.status(500).json({
        message: "Failed to fetch Discord messages",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.listen(1e4, () => {
    log("Server started on port 5000");
  });
})();
