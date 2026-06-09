import PageHero from "@/components/shared/page-hero";
import MissionVision from "@/components/about-us/mission-vision";
import OurApproaches from "@/components/about-us/our-approaches";
import Milestones from "@/components/about-us/milestones";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";

export default function AboutUs() {
    return (
        <div>
            {/* Reusable Page Hero */}
            <PageHero
                eyebrow="About Our Company"
                title={
                    <>
                        Building the Future, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Restoring the Past.
                        </span>
                    </>
                }
                description="We are a team of passionate engineers, architects, and builders committed to delivering world-class infrastructure and commercial spaces with uncompromising quality."
                backgroundImage="https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=1920&auto=format&fit=crop" // Replace with your team/site image
                primaryCta={{ label: "Meet the Team", href: "#team" }}
                secondaryCta={{ label: "Contact Us", href: "/contact" }}
                // Optional: override the height for different pages if needed
                className="min-h-[70vh]"
            />

            {/* Mission & Vision section */}
            <MissionVision />

            {/* Our Approaches section */}
            <OurApproaches />

            {/* Milestones section */}
            <Milestones />

            {/* Testimonials section */}
            <Testimonials />

            {/* FAQ section */}
            <Faq />
        </div>
    );
}