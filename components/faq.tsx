"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Plus, Minus, PhoneCall } from "lucide-react";
import { FAQS_DATA } from "@/data/faq";

// --- Framer Motion Variants ---

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const rightColumnVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.4 } },
};

export default function Faq() {
    // State to track which accordion is open. Defaulting to the second one (faq-2) to match your screenshot.
    const [ openId, setOpenId ] = useState<string>("faq-2");

    const toggleAccordion = (id: string) => {
        setOpenId((prev) => (prev === id ? "" : id));
    };

    return (
        <section className="relative w-full bg-[#F5F7FA] py-24 overflow-hidden z-0">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* --- Header --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-slate-500 font-medium tracking-wide text-sm">
                            FAQs
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-2">
                        Question? <span className="text-[#FF5E14]">Look here.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                    {/* --- Left Column: Animated Accordions --- */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        className="lg:col-span-8 flex flex-col gap-4"
                    >
                        {FAQS_DATA.map((faq) => {
                            const isOpen = openId === faq.id;

                            return (
                                <motion.div
                                    key={faq.id}
                                    variants={itemVariants}
                                    className="rounded-2xl overflow-hidden shadow-sm"
                                >
                                    <motion.div
                                        animate={{
                                            backgroundColor: isOpen ? "#00103A" : "#FFFFFF",
                                            color: isOpen ? "#FFFFFF" : "#00103A",
                                        }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="w-full"
                                    >
                                        <button
                                            onClick={() => toggleAccordion(faq.id)}
                                            className="w-full flex items-center justify-between p-6 md:px-8 text-left focus:outline-none"
                                        >
                                            <span className="text-lg md:text-xl font-bold pr-8">
                                                {faq.question}
                                            </span>
                                            <div className="shrink-0 flex items-center justify-center">
                                                {isOpen ? (
                                                    <Minus className="w-6 h-6 text-white" />
                                                ) : (
                                                    <Plus className="w-6 h-6 text-[#00103A]" />
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [ 0.04, 0.62, 0.23, 0.98 ] }}
                                                >
                                                    <div className="px-6 md:px-8 pb-8 pt-2">
                                                        {/* Inner divider line */}
                                                        <div className="w-full h-px bg-white/10 mb-6" />
                                                        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* --- Right Column: Contact Cards --- */}
                    <motion.div
                        variants={rightColumnVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        className="lg:col-span-4 flex flex-col gap-6"
                    >

                        {/* Dark Blue Contact Card */}
                        <div className="relative bg-[#00103A] rounded-[2rem] p-10 flex flex-col items-center text-center overflow-hidden shadow-lg">
                            {/* Diagonal Pattern Background matching your previous sections */}
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)",
                                }}
                            />

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Custom Chat Icon Vector */}
                                <div className="mb-6 relative w-16 h-16">
                                    {/* Back Bubble (White) */}
                                    <svg className="absolute bottom-0 right-0 w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
                                    </svg>
                                    {/* Front Bubble (Orange) */}
                                    <svg className="absolute top-0 left-0 w-12 h-12 text-[#FF5E14]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM9 11C8.45 11 8 10.55 8 10C8 9.45 8.45 9 9 9C9.55 9 10 9.45 10 10C10 10.55 9.55 11 9 11ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11ZM15 11C14.45 11 14 10.55 14 10C14 9.45 14.45 9 15 9C15.55 9 16 9.45 16 10C16 10.55 15.55 11 15 11Z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">
                                    You have different <br /> questions?
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed mb-8 px-2">
                                    Our team will answer all your questions. We ensure a quick response.
                                </p>

                                <button className="bg-[#FF5E14] hover:bg-[#e8530e] text-white px-8 py-3.5 rounded-full font-semibold transition-colors shadow-lg">
                                    Contact Us
                                </button>
                            </div>
                        </div>

                        {/* White 24/7 Support Card */}
                        <div className="bg-white rounded-[2rem] p-8 flex items-center gap-6 shadow-sm border border-slate-100">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-[#fce7e8] flex items-center justify-center text-[#FF5E14]">
                                <PhoneCall className="w-7 h-7" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-slate-500 text-sm font-medium mb-1">
                                    Your Comfort, Our Priority
                                </span>
                                <h4 className="text-[#00103A] text-xl font-bold mb-1">
                                    24/7 Service
                                </h4>
                                <span className="text-slate-400 font-medium text-sm">
                                    (+220) 379-3900
                                </span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}