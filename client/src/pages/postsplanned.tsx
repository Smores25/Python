
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionFade } from "@/components/ui/motion-fade";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { ImageViewer } from "@/components/ui/image-viewer";

const DISCORD_CHANNEL_URL = "https://canary.discord.com/channels/961457576342593606/967079731633717299";
const CHANNEL_ID = "967079731633717299";

interface DiscordMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  attachments: Array<{
    url: string;
    contentType: string;
  }>;
}

export default function Posts() {
  const { data: messages, isLoading, error } = useQuery<DiscordMessage[]>({
    queryKey: [`/api/discord/messages/${CHANNEL_ID}?type=attachment`]
  });

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <SectionHeading 
            title="GV Planned Cars" 
            subtitle="Planned stuff coming to GV!"
          />
          <a 
            href={DISCORD_CHANNEL_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4"
          >
            <Button variant="outline" className="gap-2">
              <SiDiscord className="w-5 h-5" />
              View Channel on Discord
            </Button>
          </a>
          <Button variant="ghost" className="mt-4" onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          <div className="space-y-4 p-4">
            {isLoading ? (
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Loading messages...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6">
                  <p className="text-destructive">Failed to load messages. Please try again later.</p>
                </CardContent>
              </Card>
            ) : (
              messages?.map((message, index) => (
                <MotionFade key={message.id} delay={index * 0.1}>
                  <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-primary">{message.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {message.content && (
                        <p className="text-lg mb-4 whitespace-pre-wrap">{message.content}</p>
                      )}
                      {message.referencedMessage && (
                        <div className="ml-4 pl-4 border-l-2 border-primary/20 mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Forwarded message:</p>
                          <p className="text-lg whitespace-pre-wrap">{message.referencedMessage}</p>
                        </div>
                      )}
                      {message.attachments.map((attachment, i) => (
                        attachment.contentType?.startsWith('image/') && (
                          <AspectRatio key={i} ratio={16/9} className="overflow-hidden rounded-md">
                            <ImageViewer
                              src={attachment.url}
                              alt={`Attachment from ${message.author}`}
                            />
                          </AspectRatio>
                        )
                      ))}
                    </CardContent>
                  </Card>
                </MotionFade>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
