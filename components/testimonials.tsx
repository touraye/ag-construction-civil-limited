"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/data/testimonials";

export default function Testimonials() {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ wrapperWidth, setWrapperWidth ] = useState(0);
    const [ cardsToShow, setCardsToShow ] = useState(2);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const gap = 24; // 24px gap between cards (Tailwind gap-6)

    // 1. Responsive Measurement & Layout Math
    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth);
            }
            if (window.innerWidth < 1024) {
                setCardsToShow(1);
            } else {
                setCardsToShow(2);
            }
        };

        handleResize(); // Initial measurement
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calculate card width dynamically to ensure perfect drag-snapping
    const cardWidth =
        cardsToShow === 1 ? wrapperWidth : (wrapperWidth - gap) / 2;

    // The maximum index we can slide to without showing empty space
    const maxIndex = Math.max(0, TESTIMONIALS_DATA.length - cardsToShow);

    // Safely clamp index if window is resized (e.g. rotating a tablet)
    // 1. Responsive Measurement & Layout Math
    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth);
            }

            const newCardsToShow = window.innerWidth < 1024 ? 1 : 2;
            setCardsToShow(newCardsToShow);

            // FIX: Clamp the index directly inside the resize event 
            // instead of using a separate useEffect.
            const newMaxIndex = Math.max(0, TESTIMONIALS_DATA.length - newCardsToShow);
            setCurrentIndex((prevIndex) => (prevIndex > newMaxIndex ? newMaxIndex : prevIndex));
        };

        handleResize(); // Initial measurement
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty dependency array is perfectly safe here

    // 2. Drag / Swipe Handler
    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const swipeThreshold = 50; // Pixels dragged before registering a swipe
        if (info.offset.x < -swipeThreshold && currentIndex < maxIndex) {
            setCurrentIndex((prev) => prev + 1);
        } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <section className="relative w-full bg-[#050B20] py-24 overflow-hidden z-0 select-none">

            {/* Background Patterns */}
            <div
                className="absolute top-0 left-0 w-full h-16 opacity-30 z-0 pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)" }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-16 opacity-30 z-0 pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)" }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">

                {/* Header (Fades in) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-slate-300 font-light tracking-widest text-sm uppercase">
                            Testimonials
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        Experience Shared by <br className="hidden sm:block" />
                        <span className="text-[#FF5E14]">Our Clients</span>
                    </h2>
                </motion.div>

                {/* Carousel Viewport Wrapper */}
                <div className="w-full overflow-hidden" ref={wrapperRef}>

                    {/* 
            Hint / Nudge Animation Wrapper 
            Fires when the section is scrolled into view to show users it can be dragged.
          */}
                    <motion.div
                        initial={{ x: 0 }}
                        whileInView={{ x: [ 0, -60, 0 ] }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "backOut" }}
                        className="w-full"
                    >
                        {/* Draggable Track */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }} // Causes satisfying resistance pulling past limits
                            dragElastic={0.15}
                            onDragEnd={handleDragEnd}
                            animate={{ x: -(currentIndex * (cardWidth + gap)) }} // Snaps beautifully based on state
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
                        >
                            {TESTIMONIALS_DATA.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    style={{ width: cardWidth }}
                                    className="shrink-0 bg-[#0F1836] rounded-2xl p-8 md:p-10 lg:p-12 relative overflow-hidden group shadow-lg pointer-events-none" // pointer-events-none stops image dragging from interrupting frame drag
                                >

                                    {/* Giant Background SVG Quote Mark */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/[0.03] transform transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-[55%]">
                                        <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14.017 21L16.411 14.9082C16.634 14.4326 16.745 13.918 16.745 13.4034V3H23V13.4034C23 14.8624 22.61 16.2952 21.866 17.5684L17.727 24H14.017ZM3.017 21L5.411 14.9082C5.634 14.4326 5.745 13.918 5.745 13.4034V3H12V13.4034C12 14.8624 11.61 16.2952 10.866 17.5684L6.727 24H3.017Z" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full pointer-events-auto">
                                        {/* Rating */}
                                        <div className="flex items-center gap-1.5 mb-8">
                                            <div className="flex">
                                                {[ ...Array(5) ].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-[#FF5E14] fill-current" />
                                                ))}
                                            </div>
                                            <span className="text-white font-semibold ml-2 text-lg">
                                                {testimonial.rating.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Review Content */}
                                        <h3 className="text-2xl font-bold text-white mb-4">
                                            {testimonial.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-grow pr-0 lg:pr-10">
                                            {testimonial.content}
                                        </p>

                                        {/* Author Profile */}
                                        <div className="flex items-center gap-4 mt-auto">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#1E2B58]">
                                                <Image
                                                    src={testimonial.authorAvatar}
                                                    alt={testimonial.authorName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                    draggable={false} // Prevents native image drag overriding framer-motion drag
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg">
                                                    {testimonial.authorName}
                                                </h4>
                                                <p className="text-slate-400 text-sm">
                                                    {testimonial.authorRole}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Carousel Pagination Indicators */}
                <div className="flex justify-center items-center gap-3 mt-12">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                        const isActive = currentIndex === index;
                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to testimonial group ${index + 1}`}
                                className="group py-2 px-1 flex items-center justify-center transition-all"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: isActive ? "#FF5E14" : "#28345E",
                                        width: isActive ? 24 : 16,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="h-1.5 rounded-full group-hover:bg-[#FF5E14]/80"
                                />
                            </button>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}