import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionFade } from "@/components/ui/motion-fade";
import { MessageSquare, Users, Trophy, Music } from "lucide-react";

const features = [
  {
    title: "Active Chat Channels",
    description: "Dedicated channels for different games and interests",
    icon: MessageSquare,
  },
  {
    title: "Community Events",
    description: "Regular gaming sessions",
    icon: Users,
  },
  
  /*{
    title: "Ranking System",
    description: "Level up and earn roles based on participation",
    icon: Trophy,
  },
  {
    title: "Music Bots",
    description: "Game sessions hosted",
    icon: Users,
  },*/
  
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        <SectionHeading 
          title="Server Features" 
          subtitle="Everything you need for the ultimate gaming experience"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <MotionFade key={feature.title} delay={index * 0.1}>
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </MotionFade>
          ))}
        </div>
      </div>
    </section>
  );
}
