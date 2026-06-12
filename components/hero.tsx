"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {    
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each element appearing
                delayChildren: 0.1,   // Initial delay before sequence starts
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [ 0.22, 1, 0.36, 1 ] }
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
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-24 pb-16">

            {/* Background Video */}
            <div className="absolute inset-0 z-0 w-full h-full bg-[#00103A]">
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
            <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-b from-[#00103A]/80 via-[#00103A]/50 to-[#00103A]/90" />

            {/* Main Hero Content Container */}
            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8 flex flex-col items-center text-center mt-16 md:mt-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center max-w-3xl"
                >
                    {/* Eyebrow */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">
                            Construction & Project Law
                        </span>
                        <div className="w-8 h-[2px] bg-[#FF5E14]" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        Legal Certainty for <br className="hidden sm:block" />
                        Infrastructure Projects
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-2xl"
                    >
                        Trusted within leading international construction and infrastructure
                        legal and contractual frameworks.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
                    >
                        {/* Primary Button */}
                        <Link
                            href="/consultation"
                            className="w-full sm:w-auto bg-[#FF5E14] hover:bg-[#e8530e] text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-[#FF5E14]/25 flex items-center justify-center gap-2 group"
                        >
                            Request a Consultation
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {/* Secondary Button */}
                        <Link
                            href="/experience"
                            className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm flex items-center justify-center"
                        >
                            View Our Experience
                        </Link>
                    </motion.div>
                </motion.div>
            </div>            
        </section>
    );
}