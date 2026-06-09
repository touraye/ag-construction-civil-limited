"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Target, Lightbulb } from "lucide-react";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [ 0.22, 1, 0.36, 1 ] }
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function MissionVision() {
    return (
        <section className="relative w-full bg-white py-24 overflow-hidden z-0">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* --- Header --- */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
                            Core Purpose
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-4">
                        Our Mission <span className="text-slate-300 font-light">&</span> Vision
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
                        We are driven by a commitment to excellence, shaping skylines and communities with integrity, innovation, and uncompromising quality.
                    </p>
                </motion.div>

                {/* --- Cards Container --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
                >

                    {/* --- MISSION CARD (Dark Navy) --- */}
                    <motion.div
                        variants={cardVariants}
                        className="relative bg-[#00103A] rounded-3xl p-10 md:p-12 overflow-hidden group shadow-xl"
                    >
                        {/* Background Diagonal Pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.05] pointer-events-none"
                            style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
                        />

                        {/* Animated Hover Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5E14] rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#FF5E14]/10 flex items-center justify-center mb-8 border border-[#FF5E14]/20 group-hover:scale-110 transition-transform duration-500">
                                <Target className="w-8 h-8 text-[#FF5E14]" />
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-6">
                                Our Mission
                            </h3>

                            <p className="text-slate-300 leading-relaxed text-lg">
                                To deliver exceptional construction and infrastructure solutions by blending traditional craftsmanship with cutting-edge technology. We aim to exceed client expectations through transparent communication, rigorous safety standards, and on-time project delivery.
                            </p>

                            <ul className="mt-8 space-y-3">
                                {[ "Uncompromising Quality", "Safety First Approach", "Client-Centric Process" ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5E14]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* --- VISION CARD (Crisp White) --- */}
                    <motion.div
                        variants={cardVariants}
                        className="relative bg-white border border-slate-200 rounded-3xl p-10 md:p-12 overflow-hidden group shadow-xl shadow-slate-200/50"
                    >
                        {/* Accent Top Border */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#FF5E14]" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#00103A]/5 flex items-center justify-center mb-8 border border-[#00103A]/10 group-hover:scale-110 transition-transform duration-500">
                                <Lightbulb className="w-8 h-8 text-[#00103A]" />
                            </div>

                            <h3 className="text-3xl font-bold text-[#00103A] mb-6">
                                Our Vision
                            </h3>

                            <p className="text-slate-600 leading-relaxed text-lg">
                                To be the globally recognized leader in sustainable and innovative construction. We envision a future where our structural landmarks not only stand the test of time but actively contribute to the environmental and economic well-being of the communities they serve.
                            </p>

                            <ul className="mt-8 space-y-3">
                                {[ "Sustainable Innovations", "Global Recognition", "Community Empowerment" ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00103A]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}