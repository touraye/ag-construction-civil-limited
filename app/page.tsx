import AboutUs from "@/components/about-us";
import Faq from "@/components/faq";
import FeaturedProjects from "@/components/featured-projects";
import Hero from "@/components/hero";
import HowWeWork from "@/components/how-we-work";
import ProjectProcess from "@/components/project/project-process";
import Services from "@/components/service";
import Testimonials from "@/components/testimonials";
import { WorksWith } from "@/components/works-with";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <Hero />

      {/* works with section */}
      <WorksWith />

      {/* About Us section */}
      <AboutUs />

      {/* services section */}
      <Services />

      {/* How We Works Section */}
      {/* <HowWeWork /> */}
      {/* Project Process Section */}
      <ProjectProcess showLandmark={false} />

      {/* Featured Projects section */}
      <FeaturedProjects />

      {/* Testimonials section */}
      <Testimonials />

      {/* FAQ section */}
      <Faq />

    </>
  );
}
