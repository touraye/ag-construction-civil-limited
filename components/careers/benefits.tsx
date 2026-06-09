"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { BENEFITS_DATA } from "@/data/careers";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Benefits() {
    return (
        <section id="culture" className="relative w-full bg-white py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
                            Life at Conztru
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A] mb-4">
                        Why Build Your <br className="hidden sm:block" />
                        <span className="text-[#FF5E14]">Career With Us?</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
                        We invest heavily in our people. From top-tier health coverage to continuous learning, we provide the tools you need to thrive both on and off the site.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {BENEFITS_DATA.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative bg-[#F5F7FA] rounded-3xl p-8 border border-transparent hover:border-[#FF5E14]/30 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#FF5E14]/5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#FF5E14]/20 group-hover:bg-[#FF5E14]/5 transition-all duration-300">
                                    <Icon className="w-6 h-6 text-[#00103A] group-hover:text-[#FF5E14] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-[#00103A] mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}