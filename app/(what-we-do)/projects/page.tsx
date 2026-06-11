import ProjectHero from "@/components/project/project-hero";
import ProjectsListing from "@/components/project/project-listing";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";
import ProjectProcess from "@/components/project/project-process";

export default function Projects() {
    return (
        <div>
            {/* Project Hero Section */}
            <ProjectHero />

            {/* Project Listing Section */}
            <ProjectsListing />

            {/* Project Process Section */}
            <ProjectProcess showLandmark={false} />

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <Faq />
        </div>
    );
}