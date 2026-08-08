import PageHero from "@/components/shared/page-hero";
import Benefits from "@/components/careers/benefits";
import OpenRoles from "@/components/careers/open-roles";
import Faq from "@/components/faq";
import Testimonials from "@/components/testimonials";

export default function Careers() {
    return (
        <div>
            {/* --- Reusable Page Hero --- */}
            <PageHero
                eyebrow="Join Our Team"
                title={
                    <>
                        Shape the Skyline. <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Shape Your Career.
                        </span>
                    </>
                }
                description="Join a team of visionaries, engineers, and builders. At AG Constructions, we don't just construct world-class infrastructure—we build lasting careers, foster continuous growth, and empower our people to leave a mark on the world."
                backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1920&auto=format&fit=crop" // Construction team reviewing plans
                primaryCta={{ label: "View Open Roles", href: "#open-roles" }}
                secondaryCta={{ label: "Life at AG Constructions", href: "#culture" }}
            />

            {/* Benefits Section */}
            <Benefits />

            {/* Open Roles Section */}
            <OpenRoles />

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <Faq />
        </div>
    );
}
        