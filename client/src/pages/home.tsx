import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Rules from "@/components/sections/rules";
import Community from "@/components/sections/community";
import Staff from "@/components/sections/staff";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Staff />
      <Features />
      <Rules />
      <Community />
    </div>
  );
}
