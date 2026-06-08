"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
    // Framer Motion variants for staggered animations
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each element appearing
                delayChildren: 0.3,   // Initial delay before sequence starts
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [ 0.22, 1, 0.36, 1 ] }
        },
    };

    const bottomSectionVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 1.2, duration: 0.8, ease: "easeOut" }
        },
    };

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 w-full h-full bg-slate-900">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    poster="/assets/video/video-poster.jpeg" // Optional: Add a fallback image
                >
                    <source src="/assets/video/hero-background.mp4" type="video/mp4" />
                    {/* Fallback for browsers that don't support video */}
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

            {/* Main Hero Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 flex w-full max-w-5xl flex-col items-center px-4 text-center mt-16"
            >
                <motion.span
                    variants={itemVariants}
                    className="mb-4 text-sm font-medium tracking-wide text-[#FF5E14] md:text-base uppercase"
                >
                    Construction & Project Law
                </motion.span>

                <motion.h1
                    variants={itemVariants}
                    className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl"
                >
                    Legal Certainty for <br className="hidden sm:block" />
                    Infrastructure Projects
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mb-10 max-w-2xl text-base text-slate-200 sm:text-lg md:text-xl font-light leading-relaxed"
                >
                    Trusted within leading international construction and infrastructure
                    legal and contractual frameworks.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 sm:flex-row sm:gap-6"
                >
                    <Button
                        size="lg"
                        className="bg-[#00103A] hover:bg-[#00103A]/90 hover:text-white text-white px-8 py-6 text-base font-semibold rounded-full border-white/40 transition-all shadow-lg hover:shadow-[#00103A]/25"
                        asChild
                    >
                        <Link href="/consultation">Request a Consultation</Link>
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="bg-[#FF5E14] border-white/40 text-white hover:bg-[#e8530e]hover:text-white px-8 py-6 text-base font-semibold rounded-full transition-all backdrop-blur-sm"
                        asChild
                    >
                        <Link href="/experience">View Our Experience</Link>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Industry Partners Section (Absolute Bottom) */}
            <motion.div
                variants={bottomSectionVariants}
                initial="hidden"
                animate="visible"
                className="hidden absolute bottom-4 z-20 flex w-full flex-col items-center px-4"
            >
                <p className="mb-4 text-xs font-medium text-slate-300/80 uppercase tracking-widest">
                    Industry Partners
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-80 mix-blend-screen">
                    {/* Mock Logo 1 */}
                    <div className="flex items-center gap-2 text-white">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                        </svg>
                        <span className="font-semibold text-lg tracking-tight">Logoipsum<br /><span className="text-[10px] font-normal leading-none block">Foundation</span></span>
                    </div>

                    <div className="h-1.5 w-1.5 rounded-full bg-white/40" />

                    {/* Mock Logo 2 */}
                    <div className="flex items-center gap-2 text-white">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
                        </svg>
                        <span className="font-bold text-xl tracking-tighter uppercase">Logoipsum</span>
                    </div>

                    <div className="h-1.5 w-1.5 rounded-full bg-white/40" />

                    {/* Mock Logo 3 */}
                    <div className="flex items-center gap-2 text-white">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8M8 12h8" />
                        </svg>
                        <span className="font-medium text-lg tracking-tight">Logoipsum</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}