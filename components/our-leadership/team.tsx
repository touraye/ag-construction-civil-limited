"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { FaLinkedinIn, FaXTwitter, FaEnvelope } from "react-icons/fa6";
import { TEAM_DATA } from "@/data/team";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [ 0.22, 1, 0.36, 1 ] }
    },
};

export function Team() {
    return (
        <section className="relative w-full bg-[#F5F7FA] py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* --- Section Header --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
                            Executive Board
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-4">
                        The Structure <br className="hidden sm:block" />
                        <span className="text-[#FF5E14]">Behind Our Success</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
                        A diverse group of industry veterans dedicated to pushing the boundaries of modern construction and engineering.
                    </p>
                </motion.div>

                {/* --- Team Grid --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {TEAM_DATA.map((member) => (
                        <motion.div
                            key={member.id}
                            variants={cardVariants}
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
                        >
                            {/* Image Container with Social Overlay */}
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-200">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Overlay Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00103A]/90 via-[#00103A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Social Icons (Slide up on hover) */}
                                <div className="absolute bottom-0 left-0 w-full p-6 flex justify-center gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                    {member.socials.linkedin && (
                                        <a href={member.socials.linkedin} className="w-10 h-10 rounded-full bg-white text-[#00103A] hover:bg-[#FF5E14] hover:text-white flex items-center justify-center transition-colors">
                                            <FaLinkedinIn className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.socials.twitter && (
                                        <a href={member.socials.twitter} className="w-10 h-10 rounded-full bg-white text-[#00103A] hover:bg-[#FF5E14] hover:text-white flex items-center justify-center transition-colors">
                                            <FaXTwitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.socials.email && (
                                        <a href={`mailto:${member.socials.email}`} className="w-10 h-10 rounded-full bg-white text-[#00103A] hover:bg-[#FF5E14] hover:text-white flex items-center justify-center transition-colors">
                                            <FaEnvelope className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="p-6 md:p-8 flex flex-col flex-grow text-center">
                                <h3 className="text-xl font-bold text-[#00103A] mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-[#FF5E14] font-medium text-sm mb-4">
                                    {member.role}
                                </p>
                                <div className="w-8 h-px bg-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}