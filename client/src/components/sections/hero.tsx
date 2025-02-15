import { Button } from "@/components/ui/button";
import { MotionFade } from "@/components/ui/motion-fade";
import { SiDiscord } from "react-icons/si";
import { Link } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DISCORD_CHANNEL_URL = "https://discord.gg/bSEeJpPvD8";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-[url('https://i.imgur.com/d831eTv.png')] 
        bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center">
        <MotionFade>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Welcome to ADBR Zone
          </h1>
        </MotionFade>

        <MotionFade delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            The ADBR Zone is your ultimate destination for discovering the latest leaks, updates, and content for Greenville Roblox.
          </p>
        </MotionFade>

        <MotionFade delay={0.4}>
          <div className="flex gap-4 justify-center">
            <a href={DISCORD_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <SiDiscord className="w-5 h-5" />
                Join Our Server
              </Button>
            </a>

            {/* Dropdown Button for GV Leaks */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="secondary">Posts</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => window.location.href = "/postsnews"}>GV News</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/postsfutureupdates"}>GV Future Updates</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/postsleaks"}>GV Leaks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/postsunreleased"}>GV Unreleased Cars</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/postsplanned"}>GV Planned Cars</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </MotionFade>
      </div>
    </section>
  );
}
