"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowDown, MapPin, ArrowUpRight } from "lucide-react";

// --- Hero Featured Projects Data ---
// These are the background slides that will crossfade
const HERO_SLIDES = [
    {
        id: "riyadh-metro",
        title: "Riyadh Metro",
        location: "Saudi Arabia",
        image: "https://images.unsplash.com/photo-1544983390-50d4eb0ec1d4?q=80&w=1920&auto=format&fit=crop", // Train/Metro infrastructure
    },
    {
        id: "western-sydney-airport",
        title: "Western Sydney Int. Airport",
        location: "Australia",
        image: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=1920&auto=format&fit=crop", // Crane/Airport build
    },
    {
        id: "pa-chemical-plant",
        title: "PA Chemical Plant",
        location: "Pennsylvania, U.S.",
        image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1920&auto=format&fit=crop", // Industrial night shot
    },
];

// --- Framer Motion Variants ---
const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [ 0.22, 1, 0.36, 1 ], staggerChildren: 0.2 }
    },
};

export default function ProjectHero() {
    const [ currentSlide, setCurrentSlide ] = useState(0);

    // Auto-advance the background slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const activeProject = HERO_SLIDES[ currentSlide ];

    return (
        <section className="relative flex w-full min-h-[85vh] lg:min-h-screen items-center justify-center overflow-hidden bg-[#00103A] pt-20">

            {/* === Background Image Crossfade === */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 w-full h-full"
                >
                    <Image
                        src={activeProject.image}
                        alt={activeProject.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* === Gradients === */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#00103A]/80 via-[#00103A]/40 to-[#00103A]/90" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#00103A]/60 via-transparent to-transparent" />

            {/* === Main Hero Text === */}
            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8 flex flex-col items-center md:items-start text-center md:text-left mt-[-5vh]">
                <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center md:items-start max-w-3xl"
                >
                    <motion.div variants={textVariants} className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">
                            Our Portfolio
                        </span>
                        <div className="w-8 h-[2px] bg-[#FF5E14] md:hidden" />
                    </motion.div>

                    <motion.h1
                        variants={textVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        Landmarks of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E14] to-[#ff8c54]">
                            Tomorrow.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={textVariants}
                        className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-xl"
                    >
                        Explore our curated portfolio of defining projects. From towering commercial skyscrapers to sustainable infrastructure, witness how we turn ambitious blueprints into monumental realities.
                    </motion.p>
                </motion.div>
            </div>

            {/* === Bottom Glassmorphism Bar: "Now Showing" === */}
            <div className="absolute bottom-0 left-0 w-full z-30 border-t border-white/10 bg-[#00103A]/30 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Active Background Project Info */}
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="hidden md:flex items-center gap-2">
                            {HERO_SLIDES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "w-6 bg-[#FF5E14]" : "w-2 bg-white/30"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="h-8 w-px bg-white/20 hidden md:block" />

                        <div className="flex flex-col">
                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                                Background Feature
                            </span>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-3"
                                >
                                    <h4 className="text-white font-bold text-sm md:text-base">
                                        {activeProject.title}
                                    </h4>
                                    <span className="flex items-center gap-1 text-slate-300 text-xs md:text-sm">
                                        <MapPin className="w-3 h-3 text-[#FF5E14]" />
                                        {activeProject.location}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-row-reverse md:flex-row items-center justify-between w-full md:w-auto gap-6 md:gap-8">
                        <Link
                            href={`/projects/${activeProject.id}`}
                            className="group flex items-center gap-2 text-white text-sm font-semibold hover:text-[#FF5E14] transition-colors"
                        >
                            View Project
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        {/* Scroll Down Indicator */}
                        <motion.a
                            href="#project-grid"
                            animate={{ y: [ 0, 8, 0 ] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
                        >
                            <ArrowDown className="w-4 h-4" />
                        </motion.a>
                    </div>

                </div>
            </div>

        </section>
    );
}