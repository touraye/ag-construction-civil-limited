"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PROCESS_STEPS } from "@/data/process";
import { cn } from "@/lib/utils";

const AUTO_PLAY_INTERVAL = 6000; // 6 seconds per step

export default function Process() {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ progressKey, setProgressKey ] = useState(0); // Used to force reset the progress bar animation

    // Auto-play logic
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
            setProgressKey((prev) => prev + 1);
        }, AUTO_PLAY_INTERVAL);

        // Cleanup timer on unmount or when activeIndex manually changes
        return () => clearInterval(timer);
    }, [ activeIndex ]);

    // Handle manual clicks (resets the timer)
    const handleStepClick = (index: number) => {
        setActiveIndex(index);
        setProgressKey((prev) => prev + 1);
    };

    return (
        <section className="relative w-full bg-[#050B20] py-24 lg:py-32 overflow-hidden">

            {/* Background Subtle Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-24 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">
                            Our Methodology
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                        How We <span className="text-[#FF5E14]">Accomplish Work</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* === LEFT COLUMN: Auto-playing Accordion Tabs === */}
                    <div className="flex flex-col gap-6">
                        {PROCESS_STEPS.map((step, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <div
                                    key={step.id}
                                    onClick={() => handleStepClick(index)}
                                    className="relative cursor-pointer group flex flex-col"
                                >
                                    {/* The Progress Bar Background */}
                                    <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden relative">
                                        {/* The Active Filling Bar */}
                                        {isActive && (
                                            <motion.div
                                                key={progressKey} // Force re-render animation when clicked/auto-advanced
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                                                className="absolute left-0 top-0 h-full bg-[#FF5E14]"
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-start gap-6">
                                        {/* Step Number */}
                                        <span
                                            className={cn(
                                                "text-3xl md:text-4xl font-black transition-colors duration-500",
                                                isActive ? "text-[#FF5E14]" : "text-white/20 group-hover:text-white/50"
                                            )}
                                        >
                                            {step.stepNumber}
                                        </span>

                                        <div className="flex flex-col flex-1">
                                            {/* Step Title */}
                                            <h3
                                                className={cn(
                                                    "text-2xl md:text-3xl font-bold mb-4 transition-colors duration-500",
                                                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                                                )}
                                            >
                                                {step.title}
                                            </h3>

                                            {/* Step Description (Collapsible via Framer Motion) */}
                                            <AnimatePresence initial={false}>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: [ 0.04, 0.62, 0.23, 0.98 ] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="text-slate-400 leading-relaxed text-base md:text-lg pb-4">
                                                            {step.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* === RIGHT COLUMN: Crossfading Image Showcase === */}
                    <div className="relative w-full aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#00103A]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex} // Changing the key triggers the exit/enter animations
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={PROCESS_STEPS[ activeIndex ].image}
                                    alt={PROCESS_STEPS[ activeIndex ].title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={activeIndex === 0} // Only prioritize the first image for performance
                                />

                                {/* Dark gradient to ensure the image blends perfectly with the dark theme */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#050B20]/60 via-transparent to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Decoration Frame */}
                        <div className="absolute inset-4 border border-white/20 rounded-[1.8rem] z-10 pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
}