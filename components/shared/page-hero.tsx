"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types for Reusability ---
export interface PageHeroProps {
    title: string | React.ReactNode;
    description?: string;
    backgroundImage: string;
    eyebrow?: string; // e.g., "About Us" or "Home / About"
    primaryCta?: {
        label: string;
        href: string;
    };
    secondaryCta?: {
        label: string;
        href: string;
    };
    className?: string; // Allow overriding wrapper classes (like height)
}

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

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [ 0.22, 1, 0.36, 1 ] }
    },
};

export default function PageHero({
    title,
    description,
    backgroundImage,
    eyebrow,
    primaryCta,
    secondaryCta,
    className,
}: PageHeroProps) {
    return (
        <section
            className={cn(
                "relative flex w-full items-center justify-center overflow-hidden min-h-[50vh] lg:min-h-[60vh] pt-24 pb-16",
                className
            )}
        >
            {/* --- Background Image --- */}
            <div className="absolute inset-0 z-0 w-full h-full bg-[#00103A]">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    priority // Important for LCP (Largest Contentful Paint)
                    className="object-cover"
                    sizes="100vw"
                />
            </div>

            {/* --- Dark Gradient Overlay for Readability --- */}
            <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-b from-[#00103A]/80 via-[#00103A]/50 to-[#00103A]/90" />

            {/* --- Content Container --- */}
            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8 flex flex-col items-center text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center max-w-3xl"
                >
                    {/* Optional Eyebrow / Breadcrumb */}
                    {eyebrow && (
                        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">
                                {eyebrow}
                            </span>
                            <div className="w-8 h-[2px] bg-[#FF5E14]" />
                        </motion.div>
                    )}

                    {/* Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        {title}
                    </motion.h1>

                    {/* Optional Description */}
                    {description && (
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-2xl"
                        >
                            {description}
                        </motion.p>
                    )}

                    {/* Call to Actions (CTAs) */}
                    {(primaryCta || secondaryCta) && (
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
                        >
                            {primaryCta && (
                                <Link
                                    href={primaryCta.href}
                                    className="w-full sm:w-auto bg-[#FF5E14] hover:bg-[#e8530e] text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-[#FF5E14]/25 flex items-center justify-center gap-2 group"
                                >
                                    {primaryCta.label}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}

                            {secondaryCta && (
                                <Link
                                    href={secondaryCta.href}
                                    className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm flex items-center justify-center"
                                >
                                    {secondaryCta.label}
                                </Link>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}