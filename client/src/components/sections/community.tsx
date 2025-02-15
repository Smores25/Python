import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionFade } from "@/components/ui/motion-fade";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const images = [
  {
    src: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
    alt: "Gaming community members",
  },
  {
    src: "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
    alt: "Esports tournament",
  },
  {
    src: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c",
    alt: "Gaming session",
  },
];

export default function Community() {
  return (
    <section className="py-20 px-4 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        <SectionHeading 
          title="Our Community" 
          subtitle="Join thousands of gamers in our growing community"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <MotionFade key={index} delay={index * 0.2}>
              <Card className="overflow-hidden border-primary/20">
                <CardContent className="p-2">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full rounded-sm"
                    />
                  </AspectRatio>
                </CardContent>
              </Card>
            </MotionFade>
          ))}
        </div>
      </div>
    </section>
  );
}
