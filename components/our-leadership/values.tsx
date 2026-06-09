"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ShieldCheck, HardHat, Leaf } from "lucide-react";

// --- Framer Motion Variants for Content ---
const containerVariants: Variants= {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 },
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

const VALUES_DATA = [
    {
        icon: ShieldCheck,
        title: "Integrity First",
        description: "Transparency and honesty guide every contract, conversation, and construction phase we undertake.",
    },
    {
        icon: HardHat,
        title: "Unyielding Quality",
        description: "We never cut corners. Our commitment to world-class craftsmanship ensures structures that last generations.",
    },
    {
        icon: Leaf,
        title: "Sustainable Futures",
        description: "Pioneering eco-friendly building practices to minimize environmental impact while maximizing efficiency.",
    },
];

export default function Values() {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Framer Motion Parallax Logic ---
    // Tracks the scroll progress of this specific section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: [ "start end", "end start" ], // Triggers when top of section hits bottom of viewport, ends when bottom of section hits top of viewport
    });

    // Moves the background image slightly up and down to create depth
    const backgroundY = useTransform(scrollYProgress, [ 0, 1 ], [ "-15%", "15%" ]);

    return (
        <section
            ref={containerRef}
            className="relative flex w-full min-h-[70vh] items-center justify-center overflow-hidden py-24 lg:py-32"
        >
            {/* --- Parallax Background Image --- */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0 w-full h-[130%] -top-[15%]" // Made taller than the container to allow room for panning
            >
                <Image
                    src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1920&auto=format&fit=crop" // Epic construction/steel worker background
                    alt="Construction steel framework"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>

            {/* --- Dark Overlay --- */}
            {/* Heavy gradient ensures the white text remains perfectly legible over complex imagery */}
            <div className="absolute inset-0 z-10 bg-[#00103A]/80 bg-gradient-to-b from-[#00103A]/90 via-[#00103A]/70 to-[#00103A]/90" />

            {/* --- Content --- */}
            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="flex flex-col items-center text-center"
                >

                    {/* Header */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">
                            Our Principles
                        </span>
                        <div className="w-8 h-[2px] bg-[#FF5E14]" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
                    >
                        The values we stand by.
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-slate-300 text-lg md:text-xl max-w-2xl mb-20 leading-relaxed"
                    >
                        More than just steel and concrete, our foundation is built on a steadfast commitment to the principles that govern how we treat our clients, our people, and our planet.
                    </motion.p>

                    {/* 3-Column Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
                        {VALUES_DATA.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#FF5E14]/10 border border-[#FF5E14]/20 flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-[#FF5E14]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}