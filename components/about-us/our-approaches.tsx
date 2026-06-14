"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, Variants } from "framer-motion";
import { Play } from "lucide-react";

// --- 1. Custom Animated Counter Component ---
interface AnimatedNumberProps {
    value: number;
    suffix?: string;
}

function AnimatedNumber({ value, suffix = "" }: AnimatedNumberProps) {
    const ref = useRef<HTMLSpanElement>(null);

    // once: false ensures it counts down when scrolling out, and up when scrolling in
    const inView = useInView(ref, { once: false, margin: "-10%" });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
    });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        } else {
            motionValue.set(0); // Count back to 0 when out of view
        }
    }, [ inView, motionValue, value ]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest) + suffix;
            }
        });
    }, [ springValue, suffix ]);

    return <span ref={ref}>0{suffix}</span>;
}

// --- 2. Data Definition ---
const STATS_DATA = [
    { id: "projects", value: 640, suffix: "+", label: "Projects Completed" },
    { id: "experience", value: 25, suffix: "+", label: "Years of Experience" },
    { id: "customers", value: 450, suffix: "+", label: "Happy Customers" },
    { id: "professionals", value: 120, suffix: "+", label: "Skilled Professionals" },
];

// --- 3. Framer Motion Variants ---
const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const videoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
};

const statsBarVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.4 } },
};

// --- 4. Main Component ---
export default function OurApproaches() {
    return (
        <section className="relative w-full bg-[#F5F7FA] py-24 px-6 md:px-8 overflow-hidden">
            <div className="mx-auto max-w-6xl">

                {/* --- Header Section --- */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-widest uppercase text-sm">
                            Watch The Video
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-2">
                        Watch How We Bring <br className="hidden sm:block" />
                        <span className="text-[#FF5E14]">Plans to Life</span>
                    </h2>
                </motion.div>

                {/* --- Video Thumbnail Wrapper --- */}
                <div className="relative w-full flex flex-col items-center z-10">

                    <motion.div
                        variants={videoVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] shadow-xl group overflow-hidden"
                        // The unique border radius to match the design's top-left cut
                        style={{ borderRadius: "2rem", borderTopLeftRadius: "6rem" }}
                    >
                        {/* Background Image */}
                        <Image
                            src="/assets/image/how-we-video-cover.webp"
                            alt="Construction site team"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            priority
                        />

                        {/* Dark Overlay for better button visibility */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur-sm shadow-lg transition-all hover:bg-white/20 hover:border-white"
                                aria-label="Play video"
                            >
                                {/* Custom Play Triangle to match screenshot exactly */}
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 md:w-5 md:h-5 text-[#00103A] fill-current ml-1" />
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* --- Overlapping Stats Bar --- */}
                    <motion.div
                        variants={statsBarVariants}
                        initial="hidden"
                        whileInView="visible"
                        // once: false allows the bar to re-animate if you want, but strictly for the counters we use the AnimatedNumber's internal inView hook.
                        viewport={{ once: false, margin: "-10%" }}
                        className="relative w-[90%] md:w-[85%] bg-[#00103A] rounded-2xl md:rounded-3xl p-8 md:p-10 -mt-16 md:-mt-20 z-30 shadow-2xl"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
                            {STATS_DATA.map((stat, index) => {
                                // Determine if a right border is needed (hidden on mobile, added between items on desktop)
                                const isLast = index === STATS_DATA.length - 1;

                                return (
                                    <div
                                        key={stat.id}
                                        className={`flex flex-col items-center md:items-start text-center md:text-left px-4 ${!isLast ? "md:border-r border-white/10" : ""
                                            }`}
                                    >
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2 tracking-tight">
                                            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                                        </h3>
                                        <p className="text-slate-300 text-sm md:text-base font-medium">
                                            {stat.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}