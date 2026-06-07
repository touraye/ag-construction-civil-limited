"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------
// 1. Custom Animated Counter Component
// ----------------------------------------------------------------------

interface AnimatedNumberProps {
    value: number;
    decimals?: number;
    suffix?: string;
}

function AnimatedNumber({ value, decimals = 0, suffix = "" }: AnimatedNumberProps) {
    const ref = useRef<HTMLSpanElement>(null);

    // once: false ensures it triggers every time it enters/leaves the viewport
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
            // "vice versa" requirement: count back down to 0 when out of view
            motionValue.set(0);
        }
    }, [ inView, motionValue, value ]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent =
                    Intl.NumberFormat("en-US", {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    }).format(latest) + suffix;
            }
        });
    }, [ springValue, decimals, suffix ]);

    return <span ref={ref}>0{suffix}</span>;
}

// ----------------------------------------------------------------------
// 2. Data Definition
// ----------------------------------------------------------------------

const STATS_DATA = [
    {
        id: "projects",
        value: 200,
        suffix: "+",
        label: "Aberdeen Projects",
    },
    {
        id: "years",
        value: 15,
        suffix: " Year",
        label: "Structural Guarantees",
    },
    {
        id: "rating",
        value: 4.8,
        decimals: 1,
        suffix: "/5",
        label: "Client Rating",
    },
];

// ----------------------------------------------------------------------
// 3. Main Component
// ----------------------------------------------------------------------

export default function AboutUs() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <section className="w-full bg-white py-20 lg:py-32 dark:bg-slate-950 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">

                    {/* === Left Column: Content === */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-10%" }} // Re-animates text on scroll as well
                        className="lg:col-span-6 flex flex-col justify-center"
                    >
                        {/* Eyebrow */}
                        <motion.div variants={itemVariants} className="flex items-center gap-1 mb-6">
                            {/* <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                About Us
                            </span> */}
                            {/* <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white" /> */}
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white mb-10"
                        >
                            Process-led
                            <br />
                            <span className="text-slate-400">We Design It. We Build It. We Stand Behind It.
</span> 
                        </motion.h2>

                        {/* Paragraphs */}
                        <motion.div variants={itemVariants} className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg mb-10">
                            <p>
                                Family-owned and locally grown, we&apos;ve been building Aberdeen&apos;s homes and businesses with pride for over 15 years. Our team of NHBC-certified craftsmen combines traditional techniques with modern innovation to withstand Scotland&apos;s toughest conditions.
                            </p>
                            <p>
                                From granite restoration to energy-efficient new builds, every project reflects our commitment to quality, transparency, and your complete satisfaction. We don&apos;t just construct buildings – we build relationships that last.
                            </p>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div variants={itemVariants} className="mb-16">
                            <Button
                                size="lg"
                                className="bg-[#0056e0] hover:bg-[#0048c2] text-white rounded-xl px-6 py-6 text-base shadow-lg transition-all"
                            >
                                Go to About Us Page
                                <ArrowUpRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>

                        {/* Stats Grid with Animated Counters */}
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                            {STATS_DATA.map((stat) => (
                                <div key={stat.id} className="flex flex-col gap-2">
                                    <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-900 dark:text-white tracking-tight">
                                        <AnimatedNumber
                                            value={stat.value}
                                            decimals={stat.decimals}
                                            suffix={stat.suffix}
                                        />
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* === Right Column: Masonry Image Grid === */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-10%" }}
                        className="lg:col-span-6 h-[500px] sm:h-[600px] lg:h-[700px] w-full"
                    >
                        <div className="flex gap-4 sm:gap-6 h-full w-full">

                            {/* Left Tall Image */}
                            <div className="w-[45%] relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm group">
                                <Image
                                    src="/assets/image/about-us-img1.jpg"
                                    alt="Construction worker working at heights"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </div>

                            {/* Right Stacked Images */}
                            <div className="w-[55%] flex flex-col gap-4 sm:gap-6">
                                {/* Top Wide Image */}
                                <div className="h-[40%] relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm group">
                                    <Image
                                        src="/assets/image/about-us-img2.jpg"
                                        alt="Our construction team"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                </div>

                                {/* Bottom Square-ish Image */}
                                <div className="h-[60%] relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm group">
                                    <Image
                                        src="/assets/image/about-us-img3.jpg"
                                        alt="Building framing perspective"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}