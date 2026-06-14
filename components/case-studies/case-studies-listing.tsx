"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Target, TrendingUp } from "lucide-react";
import { CASE_STUDIES, CaseStudyCategory } from "@/data/case-studies";

export default function CaseStudiesListing() {
    const [ activeCategory, setActiveCategory ] = useState<CaseStudyCategory | "All">("All");

    // Derive unique categories from data
    const categories = useMemo(() => {
        const cats = new Set(CASE_STUDIES.map(cs => cs.category));
        return [ "All", ...Array.from(cats) ] as (CaseStudyCategory | "All")[];
    }, []);

    // Filter logic
    const filteredStudies = useMemo(() => {
        return CASE_STUDIES.filter(cs =>
            activeCategory === "All" ? true : cs.category === activeCategory
        );
    }, [ activeCategory ]);

    return (
        <section id="case-studies-list" className="relative w-full bg-[#F5F7FA] py-20 lg:py-32 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* === Filter Bar === */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00103A] tracking-tight shrink-0">
                        Proven <span className="text-[#FF5E14]">Results</span>
                    </h2>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide snap-x">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`snap-center shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                                        ? "bg-[#00103A] text-white shadow-md"
                                        : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* === Animated Grid === */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 min-h-[600px] content-start">
                    <AnimatePresence mode="popLayout">
                        {filteredStudies.map((cs) => (
                            <motion.article
                                layout
                                key={cs.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 250, damping: 25 }}
                                className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                            >
                                <Link href={`/case-studies/${cs.slug}`} className="flex flex-col h-full">

                                    {/* Image Container (Wider aspect ratio for case studies) */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
                                        <Image
                                            src={cs.coverImage}
                                            alt={cs.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#00103A]/80 via-transparent to-transparent opacity-80" />

                                        {/* Category & Client Overlay */}
                                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                            <div>
                                                <span className="inline-block px-3 py-1 bg-[#FF5E14] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-md">
                                                    {cs.category}
                                                </span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#FF5E14] transition-colors leading-tight">
                                                    {cs.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex flex-col flex-grow">

                                        {/* The Challenge */}
                                        <div className="mb-8 flex-grow">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Target className="w-5 h-5 text-[#00103A]" />
                                                <h4 className="text-[#00103A] font-bold text-lg">The Challenge</h4>
                                            </div>
                                            <p className="text-slate-500 leading-relaxed">
                                                {cs.challenge}
                                            </p>
                                        </div>

                                        {/* The Impact / Results Highlight */}
                                        <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-100 group-hover:border-[#FF5E14]/20 group-hover:bg-[#FF5E14]/5 transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrendingUp className="w-4 h-4 text-[#FF5E14]" />
                                                        <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Key Impact</span>
                                                    </div>
                                                    <p className="text-[#00103A] font-extrabold text-xl md:text-2xl">
                                                        {cs.impactHighlight}
                                                    </p>
                                                </div>

                                                {/* Hover Arrow */}
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#00103A] group-hover:bg-[#FF5E14] group-hover:text-white shadow-sm transition-all duration-300">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </section>
    );
}