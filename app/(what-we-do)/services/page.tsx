import PageHero from "@/components/shared/page-hero";
import Faq from "@/components/faq";
import Testimonials from "@/components/testimonials";
import ServicesListing from "@/components/services/services-listing";
import Process from "@/components/services/process";

export default function Services() {
    return (
        <div>
            {/* --- Reusable Page Hero --- */}
            <PageHero
                eyebrow="Our Expertise"
                title={
                    <>
                        Building the Future. <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Engineering Excellence.
                        </span>
                    </>
                }
                description="From visionary commercial developments to resilient heavy civil infrastructure, we provide end-to-end construction services designed to turn your most complex blueprints into reality."
                backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop" // Epic wide-angle skyscraper/architecture shot
                primaryCta={{ label: "Explore Services", href: "#all-services" }}
                secondaryCta={{ label: "Request a Proposal", href: "/contact" }}
            />

            {/* 2. Scroll-Spy Sticky Services Component */}            
            <ServicesListing />

            {/* Process section */}
            <Process />

            {/* Testimonial section */}
            <Testimonials />

            {/* FAQ section */}
            <Faq />
        </div>
    );
}