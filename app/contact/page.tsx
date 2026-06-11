import PageHero from "@/components/shared/page-hero";
import ContactSection from "@/components/contact/contact";
import Map from "@/components/contact/map";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";

export default function Contact() {
    return (
        <div>
            <PageHero
                eyebrow="Contact Us"
                title={
                    <>
                        Build Something <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Incredible.
                        </span>
                    </>
                }
                description="Whether you are planning a massive commercial development or need expert consultation on infrastructure, our global team is ready to deliver."
                backgroundImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1920&auto=format&fit=crop" // Architecture background
            />

            {/* Contact Information */}
            <ContactSection />

            {/* Map section*/}
            <Map />

            {/* Testimonials section */}
            <Testimonials />

            {/* FAQ section */}
            <Faq />
        </div>
    );
}