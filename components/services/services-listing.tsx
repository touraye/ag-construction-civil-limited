"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SERVICES_LIST } from "@/data/services";
import { cn } from "@/lib/utils";

export default function ServicesListing() {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

    // 1. Reset image slideshow to the first image whenever the active service changes
    // useEffect(() => {
    //     setCurrentImageIndex(0);
    // }, [ activeIndex ]);

    // 2. Auto-play the slideshow for the currently active service
    useEffect(() => {
        const imagesCount = SERVICES_LIST[ activeIndex ].images.length;

        // If there's only 1 image, no need to set up a slideshow interval
        if (imagesCount <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
        }, 4000); // Crossfade every 4 seconds

        return () => clearInterval(interval);
    }, [ activeIndex ]);

    // Handle service changes synchronously to avoid cascading renders
    const handleServiceChange = (index: number) => {
        if (activeIndex !== index) {
            setActiveIndex(index);
            setCurrentImageIndex(0); // Instantly reset the image index
        }
    };

    return (
        // scroll-mt-24 ensures anchor links (like #all-services) don't get hidden under fixed navbars
        <section id="all-services" className="relative w-full bg-white scroll-mt-24">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* Note: DO NOT add items-start here. The columns must stretch to equal height for sticky to work */}
                <div className="flex flex-col lg:flex-row relative gap-12 lg:gap-20">

                    {/* === LEFT COLUMN: Sticky Image Container (Desktop Only) === */}
                    <div className="hidden lg:block w-1/2 relative">
                        {/* 
              sticky top-32: Locks 8rem from the top of the viewport
              h-[75vh]: Gives it a substantial cinematic height
            */}
                        <div className="sticky top-32 h-[75vh] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center">

                            {/* True Crossfade (removed mode="wait") */}
                            <AnimatePresence>
                                <motion.div
                                    key={`${activeIndex}-${currentImageIndex}`}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={SERVICES_LIST[ activeIndex ].images[ currentImageIndex ]}
                                        alt={SERVICES_LIST[ activeIndex ].title}
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                        priority
                                    />
                                    {/* Subtle Dark Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A]/70 via-transparent to-transparent opacity-60" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Floating Label and Slideshow Indicators */}
                            <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-4">

                                <motion.div
                                    key={`label-${activeIndex}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/20 inline-block w-max"
                                >
                                    <span className="text-[#00103A] font-bold tracking-wide">
                                        {SERVICES_LIST[ activeIndex ].title}
                                    </span>
                                </motion.div>

                                {/* Dots indicating multiple images */}
                                {SERVICES_LIST[ activeIndex ].images.length > 1 && (
                                    <div className="flex items-center gap-2 pl-4">
                                        {SERVICES_LIST[ activeIndex ].images.map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-500",
                                                    currentImageIndex === i ? "w-6 bg-[#FF5E14]" : "w-2 bg-white/50"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* === RIGHT COLUMN: Scrollable Text Content === */}
                    <div className="w-full lg:w-1/2 flex flex-col pb-[15vh] lg:pb-[30vh] pt-[10vh]">
                        {SERVICES_LIST.map((service, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <motion.div
                                    key={service.id}
                                    onViewportEnter={() => handleServiceChange(index)}
                                    viewport={{ margin: "-50% 0px -50% 0px" }}
                                    className="flex flex-col min-h-[60vh] justify-center py-12 lg:py-32 border-b border-slate-100 last:border-0"
                                >

                                    {/* Step Number Indicator */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-500",
                                                isActive ? "bg-[#FF5E14] text-white" : "bg-slate-100 text-slate-400"
                                            )}
                                        >
                                            0{index + 1}
                                        </div>
                                        <div
                                            className={cn(
                                                "h-[2px] w-12 transition-colors duration-500",
                                                isActive ? "bg-[#FF5E14]" : "bg-slate-100"
                                            )}
                                        />
                                    </div>

                                    <h2
                                        className={cn(
                                            "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 transition-colors duration-500",
                                            isActive ? "text-[#00103A]" : "text-slate-300"
                                        )}
                                    >
                                        {service.title}
                                    </h2>

                                    <p
                                        className={cn(
                                            "text-base md:text-lg leading-relaxed mb-8 transition-colors duration-500",
                                            isActive ? "text-slate-600" : "text-slate-300"
                                        )}
                                    >
                                        {service.description}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-4">
                                        {service.features.map((feature, fIndex) => (
                                            <li
                                                key={fIndex}
                                                className={cn(
                                                    "flex items-center gap-3 transition-colors duration-500",
                                                    isActive ? "text-[#00103A]" : "text-slate-300"
                                                )}
                                            >
                                                <CheckCircle2
                                                    className={cn(
                                                        "w-5 h-5 shrink-0 transition-colors duration-500",
                                                        isActive ? "text-[#FF5E14]" : "text-slate-200"
                                                    )}
                                                />
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Mobile Image Fallback (Hidden on Desktop) */}
                                    <div className="block lg:hidden w-full h-[300px] sm:h-[400px] relative mt-10 rounded-3xl overflow-hidden shadow-lg">
                                        <AnimatePresence>
                                            <motion.div
                                                key={currentImageIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6 }}
                                                className="absolute inset-0"
                                            >
                                                <Image
                                                    src={service.images[ currentImageIndex ]}
                                                    alt={service.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 1024px) 100vw, 0vw"
                                                />
                                            </motion.div>
                                        </AnimatePresence>
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