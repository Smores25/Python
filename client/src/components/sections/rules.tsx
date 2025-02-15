import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionFade } from "@/components/ui/motion-fade";

const rules = [
  "Any form of discrimination will result in a warn or ban.",
  "We expect all members to respect one another and if arguments are to break out, we expect you to take it to your dms.",
  "Any sensitive topics (political talks, major events, events involving the death of a real person(s), etc.) are not to be discussed within the server, especially if staff have asked you not to speak about them.",
  "No spamming or excessive self-promotion",
  "Any Type of NSFW is not allowed.",
  "We have dedicated channels for advertising. Do not advertise anything (servers, YouTube channels, etc.) unless you have been given permission by ADBR or the co-owners.",
];

export default function Rules() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          title="Server Rules" 
          subtitle="Help us maintain a friendly and welcoming community"
        />

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <MotionFade key={index} delay={index * 0.1}>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <p className="text-lg">{rule}</p>
                  </div>
                </MotionFade>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
