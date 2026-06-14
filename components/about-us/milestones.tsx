"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { MILESTONES_DATA, Milestone } from "@/data/milestones";
import { cn } from "@/lib/utils";

// --- Framer Motion Variants ---
const slideLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Milestones() {
    // State tracking the currently active milestone in the center of the viewport
    const [ activeIndex, setActiveIndex ] = useState(0);

    return (
        <section className="relative w-full bg-[#F5F7FA] py-24 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6 md:px-8">

                {/* --- Header Section --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-widest uppercase text-sm">
                            Our Story
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-2">
                        Milestones That <br className="hidden sm:block" />
                        <span className="text-[#FF5E14]">Define Us</span>
                    </h2>
                </motion.div>

                {/* --- Timeline Container --- */}
                <div className="relative w-full">

                    {/* Continuous Center Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 z-0" />

                    <div className="flex flex-col gap-16 md:gap-24">
                        {MILESTONES_DATA.map((milestone, index) => {
                            const isEven = index % 2 === 0;
                            const isActive = index === activeIndex;

                            return (
                                <motion.div
                                    key={milestone.id}
                                    // This triggers the active index update exactly when the middle of the item crosses the middle of the screen
                                    onViewportEnter={() => setActiveIndex(index)}
                                    viewport={{ margin: "-50% 0px -50% 0px" }}
                                    className="relative flex flex-col md:flex-row items-center w-full group"
                                >

                                    {/* --- Central Animated Dot --- */}
                                    <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-8 h-8 flex items-center justify-center z-20">
                                        {isActive ? (
                                            // The layoutId magic allows the active dot to glide seamlessly down the line
                                            <motion.div
                                                layoutId="activeTimelineIndicator"
                                                className="flex items-center justify-center w-6 h-6 rounded-full border-[3px] border-[#FF5E14] bg-[#F5F7FA] shadow-sm"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            >
                                                <div className="w-1.5 h-1.5 bg-[#FF5E14] rounded-full" />
                                            </motion.div>
                                        ) : (
                                            <div className="w-2.5 h-2.5 bg-[#00103A] rounded-full transition-colors duration-300 delay-100" />
                                        )}
                                    </div>

                                    {/* --- Desktop: Alternating Layout | Mobile: Stacked Layout --- */}

                                    {/* Left Column (Image on Even rows, Text on Odd rows) */}
                                    <div
                                        className={cn(
                                            "w-full md:w-1/2 pl-16 md:pl-0 pr-0 md:pr-12 lg:pr-16 flex",
                                            isEven ? "md:justify-end" : "md:justify-end"
                                        )}
                                    >
                                        {isEven ? (
                                            <ImageBlock image={milestone.image} alt={milestone.title} isEven={isEven} delay={0.1} />
                                        ) : (
                                            <TextBlock milestone={milestone} isActive={isActive} align="right" delay={0.2} />
                                        )}
                                    </div>

                                    {/* Right Column (Text on Even rows, Image on Odd rows) */}
                                    <div
                                        className={cn(
                                            "w-full md:w-1/2 pl-16 md:pl-12 lg:pl-16 pr-0 flex mt-8 md:mt-0",
                                            isEven ? "md:justify-start" : "md:justify-start"
                                        )}
                                    >
                                        {isEven ? (
                                            <TextBlock milestone={milestone} isActive={isActive} align="left" delay={0.2} />
                                        ) : (
                                            <ImageBlock image={milestone.image} alt={milestone.title} isEven={isEven} delay={0.1} />
                                        )}
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Sub-Components for Clean Code Separation ---

function ImageBlock({ image, alt, isEven, delay }: { image: string; alt: string; isEven: boolean; delay: number }) {
    return (
        <motion.div
            variants={isEven ? slideLeft : slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay }}
            className="relative w-full max-w-md h-[280px] md:h-[320px] shadow-sm"
        >
            <Image
                src={image}
                alt={alt}
                fill
                className={cn(
                    "object-cover",
                    // The exact alternating corner radius shapes from your design mockup
                    isEven
                        ? "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl"
                        : "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl"
                )}
            />
        </motion.div>
    );
}

function TextBlock({ milestone, isActive, align, delay }: { milestone: Milestone; isActive: boolean; align: "left" | "right"; delay: number }) {
    const isRightAligned = align === "right";

    return (
        <motion.div
            variants={isRightAligned ? slideLeft : slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay }}
            className={cn(
                "relative flex flex-col w-full max-w-md",
                isRightAligned ? "md:items-end md:text-right" : "md:items-start text-left"
            )}
        >
            {/* Horizontal Line connecting Year Pill to Center Line (Desktop Only) */}
            <div
                className={cn(
                    "absolute top-4 w-12 lg:w-16 h-px bg-slate-200 hidden md:block -z-10",
                    isRightAligned ? "left-full" : "right-full"
                )}
            />

            {/* Year Pill */}
            <div
                className={cn(
                    "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors duration-500 mb-6 relative z-10",
                    isActive
                        ? "bg-[#00103A] text-white"
                        : "bg-white text-[#00103A]"
                )}
            >
                {milestone.year}
            </div>

            <h3 className="text-2xl font-bold text-[#00103A] mb-4 transition-colors">
                {milestone.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
                {milestone.description}
            </p>
        </motion.div>
    );
}