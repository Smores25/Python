import { SectionHeading } from "@/components/ui/section-heading";

export default function Footer() {
  return (
    <footer className="py-10 px-4 text-muted-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">

          {/* About Us Section */}
          <div className="flex-1 px-6 md:px-8">
            <SectionHeading subtitle="About Us" className="text-lg md:text-xl" />
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-prose">
              The ADBR Zone is your ultimate destination for discovering the latest leaks, updates, and content for Greenville Roblox.
            </p>
          </div>

          {/* Contact Us Section with Custom Transparent Divider */}
          <div className="flex-1 px-6 md:px-8 border-l" style={{ borderColor: "rgba(100, 100, 100, 0.2)" }}>
            <SectionHeading subtitle="Contact Us" className="text-lg md:text-xl" />
            <div className="space-y-2 mt-4">
              <p className="text-base md:text-lg text-muted-foreground">
                <a href="https://discord.gg/bSEeJpPvD8" target="_blank" rel="noopener noreferrer" className="text-muted-foreground">Discord</a>
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                <a href="https://www.instagram.com/the_adbr_zone/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground">Instagram</a>
              </p>
            </div>
          </div>

          {/* Legal Section with Custom Transparent Divider */}
          <div className="flex-1 px-6 md:px-8 border-l" style={{ borderColor: "rgba(100, 100, 100, 0.2)" }}>
            <SectionHeading subtitle="Legal" className="text-lg md:text-xl" />
            <div className="space-y-2 mt-4">
              <p className="text-base md:text-lg text-muted-foreground">
                <a href="" className="text-muted-foreground">Terms of Service</a>
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                <a href="" className="text-muted-foreground">Privacy Policy</a>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Divider with Custom Transparency */}
        <div className="mt-12 border-t py-6" style={{ borderColor: "rgba(100, 100, 100, 0.2)" }}>
          <p className="text-center text-base md:text-lg text-muted-foreground">
            © 2025 The ADBR Zone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}