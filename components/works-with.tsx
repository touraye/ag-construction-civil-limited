"use client";

import React from "react";
import { motion } from "framer-motion";

// ----------------------------------------------------------------------
// Mock SVGs to match the "Logoipsum" variants in the screenshot
// Replace these with your actual client logos (using Next.js <Image /> or raw SVGs)
// ----------------------------------------------------------------------

const Logo1 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <path d="M25 10h-5v20h20v-5H25V10z" />
        <text x="50" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

const Logo2 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <path d="M20 20l-10-10v20z" />
        <path d="M30 20l10 10V10z" />
        <text x="50" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

const Logo3 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <circle cx="25" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
        <text x="45" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

const Logo4 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <path d="M15 15h20v10H15z" />
        <path d="M20 10h10v20H20z" />
        <text x="45" y="27" fontSize="20" fontStyle="italic" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

const Logo5 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <path d="M15 20a10 10 0 1 0 20 0 10 10 0 1 0-20 0" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M25 15v10M20 20h10" stroke="currentColor" strokeWidth="3" />
        <text x="45" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

const Logo6 = () => (
    <svg className="h-8 w-auto text-slate-500" viewBox="0 0 150 40" fill="currentColor">
        <path d="M20 10l10 20h-5l-2.5-5h-5l-2.5 5h-5z" />
        <text x="45" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Logoipsum</text>
    </svg>
);

// Array of unique logos
const LOGOS = [ Logo1, Logo2, Logo3, Logo4, Logo5, Logo6 ];

export function WorksWith() {
    return (
        <section className="relative flex flex-col items-center justify-center border-y border-slate-200/50 bg-[#FCFBF8] py-10 overflow-hidden dark:bg-slate-950 dark:border-slate-800">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8">

                {/* Optional Section Title (Hidden visually but good for accessibility) */}
                <h2 className="sr-only">Companies we work with</h2>
                <p className="mb-8 text-xs text-center font-medium text-slate-600/80 uppercase tracking-widest">
                    Industry Partners
                </p>

                {/* 
          Container with CSS Mask for edge fading 
          This creates the smooth fade-in/out gradient on the left and right sides
        */}
                <div
                    className="relative flex w-full overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    }}
                >
                    {/* 
            Framer Motion Marquee 
            We duplicate the logo array multiple times to ensure the container is wide enough 
            to continuously loop without snapping or showing blank space.
          */}
                    <motion.div
                        className="flex w-max items-center gap-16 pr-16"
                        animate={{
                            x: [ "0%", "-50%" ],
                        }}
                        transition={{
                            duration: 35, // Adjust speed (lower = faster)
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {/* First Set of Logos */}
                        <div className="flex w-max items-center gap-16">
                            {LOGOS.map((Logo, index) => (
                                <div key={`set1-${index}`} className="flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 grayscale hover:grayscale-0">
                                    <Logo />
                                </div>
                            ))}
                            {/* Duplicate internal set to guarantee screen width coverage on ultra-wides */}
                            {LOGOS.map((Logo, index) => (
                                <div key={`set1-dup-${index}`} className="flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 grayscale hover:grayscale-0">
                                    <Logo />
                                </div>
                            ))}
                        </div>

                        {/* Second Set of Logos (Exact duplicate for seamless looping) */}
                        <div className="flex w-max items-center gap-16">
                            {LOGOS.map((Logo, index) => (
                                <div key={`set2-${index}`} className="flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 grayscale hover:grayscale-0">
                                    <Logo />
                                </div>
                            ))}
                            {LOGOS.map((Logo, index) => (
                                <div key={`set2-dup-${index}`} className="flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 grayscale hover:grayscale-0">
                                    <Logo />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}