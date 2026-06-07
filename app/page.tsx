import AboutUs from "@/components/about-us";
import Hero from "@/components/hero";
import HowWeWork from "@/components/how-we-work";
import Services from "@/components/service";
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
      <HowWeWork />

    </>
  );
}
