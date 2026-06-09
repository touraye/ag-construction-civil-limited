import PageHero from "@/components/shared/page-hero";
import { Team } from "@/components/our-leadership/team";
import Values from "@/components/our-leadership/values";
import Faq from "@/components/faq";
import Testimonials from "@/components/testimonials";

export default function OurLeadership() {
  return (
    <div>
      {/* --- Reusable Page Hero --- */}
      <PageHero
        eyebrow="Our Leadership"
        title={
          <>
            Meet the Minds <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
              Behind AG.
            </span>
          </>
        }
        description="Our executive team brings decades of combined global experience in engineering, architecture, and construction management. They are the driving force behind our commitment to uncompromising quality."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop" // Professional team meeting placeholder
        primaryCta={{ label: "Join Our Team", href: "/careers" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />

      {/* Team section */}
      <Team />

      {/* Values section */}
      <Values />

      {/* Testimonials section */}
      <Testimonials />

      {/* FAQ section */}
      <Faq />
    </div>
  );
}