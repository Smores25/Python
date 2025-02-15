
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionFade } from "@/components/ui/motion-fade";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface StaffMember {
  id: string;
  username: string;
  avatarUrl: string;
  roles: string[];
}

export default function Staff() {
  const { data: staffMembers, isLoading, error } = useQuery<StaffMember[]>({
    queryKey: ["/api/discord/staff"]
  });

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Our Staff"
          subtitle="Meet the team behind ADBR Zone"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-muted-foreground">Loading staff members...</p>
          ) : error ? (
            <p className="text-destructive">Failed to load staff members</p>
          ) : (
            staffMembers?.map((member) => (
              <MotionFade key={member.id}>
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <img src={member.avatarUrl} alt={member.username} />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.username}</h3>
                      <div className="space-y-1 mt-1">
                        {member.roles.map((role, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2 mb-2"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionFade>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
