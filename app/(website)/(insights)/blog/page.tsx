import PageHero from "@/components/shared/page-hero";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";
import BlogListing from "@/components/blog/blog-listing";

export default function Blogs() {
    return (
        <div>
            {/* 1. Reusable Page Hero */}
            <PageHero
                eyebrow="Insights & News"
                title={
                    <>
                        Our Latest <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Thoughts & Updates.
                        </span>
                    </>
                }
                description="Stay up to date with the latest industry trends, company milestones, and insights from our engineering and architecture experts."
                backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop" // Corporate office/architecture space
                primaryCta={{ label: "Subscribe to Newsletter", href: "#" }}
            />

            {/* Blog Listing section */}
            <BlogListing />

            {/* Testimonials sections */}
            <Testimonials />

            {/* FAQ section */}
            <Faq />
        </div>
    );
}