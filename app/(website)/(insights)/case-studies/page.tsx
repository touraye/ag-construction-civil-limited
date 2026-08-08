import CaseStudiesListing from "@/components/case-studies/case-studies-listing";
import Faq from "@/components/faq";
import PageHero from "@/components/shared/page-hero";
import Testimonials from "@/components/testimonials";

export default function CaseStudies() {
    return (
        <>
            {/* 1. Reusable Page Hero */}
            <PageHero
                eyebrow="Case Studies"
                title={
                    <>
                        Engineering Solutions. <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Delivering Impact.
                        </span>
                    </>
                }
                description="We don't just build structures; we solve complex logistical, environmental, and engineering challenges. Dive into our case studies to see how we tackle the impossible."
                backgroundImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1920&auto=format&fit=crop" // Epic structural beams/construction shot
                primaryCta={{ label: "View All Cases", href: "#case-studies-list" }}
            />

            {/* Case Studies Listing section */}
            <CaseStudiesListing />

            {/* Testimonials section */}
            <Testimonials />

            {/* FAQ section */}
            <Faq />
        </>
    );
}