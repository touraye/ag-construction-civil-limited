"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ClipboardCheck, HardHat, Key } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Process Data ---
const PROCESS_STEPS = [
    {
        id: "consultation",
        title: "Consultation & Planning",
        icon: ClipboardCheck,
        description: "Every landmark starts with a conversation. We define the scope, analyze site feasibility, and map out a transparent timeline and budget before any ground is broken.",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "construction",
        title: "Design & Construction",
        icon: HardHat,
        description: "Our world-class engineers and builders take over. Utilizing cutting-edge technology and rigorous safety protocols, we bring the blueprints to life flawlessly and on schedule.",
        image: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "handover",
        title: "Inspection & Handover",
        icon: Key,
        description: "We don't just finish; we perfect. After exhaustive structural and aesthetic quality-control inspections, we hand over the keys to your new reality.",
        image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1600&auto=format&fit=crop",
    },
];

const AUTO_PLAY_INTERVAL = 6000; // 6 seconds per step

export default function ProjectProcess({ showLandmark = true }: { showLandmark?: boolean }) {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ progressKey, setProgressKey ] = useState(0);

    // Auto-play logic
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
            setProgressKey((prev) => prev + 1);
        }, AUTO_PLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [ activeIndex ]);

    const handleStepClick = (index: number) => {
        setActiveIndex(index);
        setProgressKey((prev) => prev + 1); // Reset animation
    };

    return (
        <section className="relative w-full bg-[#00103A] py-24 lg:py-32 overflow-hidden">

            {/* Background Diagonal Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">

                {/* === Section Header === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#FF5E14] font-medium tracking-widest text-sm uppercase">
                            How It Comes Together
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        From Concept
                        <span className="text-[#FF5E14]"> to Concrete</span>                        
                    </h2>
                </motion.div>

                {/* === Horizontal Auto-Progressing Timeline === */}
                <div className="flex flex-col mb-16">
                    {/* Timeline Nodes */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-0 relative z-10">
                        {PROCESS_STEPS.map((step, index) => {
                            const isActive = index === activeIndex;
                            const isPast = index < activeIndex;
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.id}
                                    onClick={() => handleStepClick(index)}
                                    className="flex-1 cursor-pointer group"
                                >
                                    <div className="flex items-center mb-4 md:mb-6 px-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0",
                                            isActive || isPast
                                                ? "bg-[#FF5E14] border-[#FF5E14] text-white"
                                                : "bg-transparent border-white/20 text-white/50 group-hover:border-white/50"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <h3 className={cn(
                                            "ml-4 font-bold text-lg transition-colors duration-500",
                                            isActive || isPast ? "text-white" : "text-white/50 group-hover:text-white/80"
                                        )}>
                                            {step.title}
                                        </h3>
                                    </div>

                                    {/* Progress Bar Track */}
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative hidden md:block">
                                        {/* The Active Filling Bar */}
                                        {isActive && (
                                            <motion.div
                                                key={`active-${progressKey}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                                                className="absolute left-0 top-0 h-full bg-[#FF5E14]"
                                            />
                                        )}
                                        {/* Instantly filled bar for past steps */}
                                        {isPast && (
                                            <div className="absolute left-0 top-0 h-full w-full bg-[#FF5E14]" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* === Active Content & Image Crossfade === */}
                <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl bg-[#050B20] min-h-[400px] lg:min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full flex flex-col lg:flex-row"
                        >
                            {/* Text Description Box */}
                            <div className="w-full lg:w-2/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-20 bg-[#050B20]/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
                                {/* Subtle gradient specifically behind the text on desktop */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#050B20] via-[#050B20]/90 to-transparent hidden lg:block -z-10" />

                                <h4 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                    {PROCESS_STEPS[ activeIndex ].title}
                                </h4>
                                <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                                    {PROCESS_STEPS[ activeIndex ].description}
                                </p>
                            </div>

                            {/* Background Image */}
                            <div className="absolute inset-0 w-full h-full z-0 lg:left-1/3 lg:w-2/3">
                                <Image
                                    src={PROCESS_STEPS[ activeIndex ].image}
                                    alt={PROCESS_STEPS[ activeIndex ].title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                />
                                {/* Gradient blend to merge image with the dark background */}
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050B20] via-transparent to-transparent opacity-90" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* === Final Call to Action (CTA) === */}
              { showLandmark && ( <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-20 flex flex-col md:flex-row items-center justify-between bg-[#FF5E14] rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Subtle overlay shapes on the CTA */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Ready to build your landmark?
                        </h3>
                        <p className="text-white/80 text-lg">
                            Our experts are ready to turn your vision into reality.
                        </p>
                    </div>

                    <Link
                        href="/contact"
                        className="relative z-10 shrink-0 bg-white text-[#00103A] hover:bg-[#00103A] hover:text-white px-8 py-4 rounded-full font-bold transition-colors shadow-lg flex items-center gap-2 group"
                    >
                        Start a Project
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>)
}
            </div>
        </section>
    );
}