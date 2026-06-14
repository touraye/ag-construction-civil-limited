"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Target, TrendingUp, ArrowRight } from "lucide-react";
import { CaseStudy } from "@/data/case-studies";

export function SimilarCaseStudies({ cases }: { cases: CaseStudy[] }) {
    if (!cases || cases.length === 0) return null;

    return (
        <section className="py-20 lg:py-32 bg-[#F5F7FA] dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">Case Studies</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#00103A] dark:text-white tracking-tight">
                            Similar <span className="text-[#FF5E14]">Success Stories</span>
                        </h2>
                    </div>
                    <Link href="/case-studies#case-studies-list" className="hidden md:flex items-center gap-2 text-[#FF5E14] font-bold hover:text-[#FF4500] transition-colors group">
                        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {cases.slice(0, 2).map((cs, idx) => (
                        <motion.article
                            key={cs.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800"
                        >
                            <Link href={`/case-studies/${cs.slug}`} className="flex flex-col h-full">
                                <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
                                    <Image src={cs.coverImage} alt={cs.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A]/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="inline-block px-3 py-1 bg-[#FF5E14] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">{cs.category}</span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#FF5E14] transition-colors leading-tight">{cs.title}</h3>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-8 flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Target className="w-5 h-5 text-[#00103A] dark:text-white" />
                                            <h4 className="text-[#00103A] dark:text-white font-bold text-lg">The Challenge</h4>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{cs.challenge}</p>
                                    </div>
                                    <div className="bg-[#F5F7FA] dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 group-hover:border-[#FF5E14]/20 group-hover:bg-[#FF5E14]/5 transition-colors duration-300">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp className="w-4 h-4 text-[#FF5E14]" />
                                                    <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Key Impact</span>
                                                </div>
                                                <p className="text-[#00103A] dark:text-white font-extrabold text-xl">{cs.impactHighlight}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[#00103A] dark:text-white group-hover:bg-[#FF5E14] group-hover:text-white shadow-sm transition-all duration-300">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}