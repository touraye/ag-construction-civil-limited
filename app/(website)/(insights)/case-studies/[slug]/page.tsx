"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Target, TrendingUp, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SimilarCaseStudies } from "@/components/case-studies/similar-case-studies";
import CTA from "@/components/shared/cta";
import { CASE_STUDIES, CaseStudy } from "@/data/case-studies";

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
    const cs: CaseStudy = CASE_STUDIES[ 0 ]; // Replace with: CASE_STUDIES.find(p => p.slug === params.slug)

    // Smart Filtering for Similar Case Studies
    const similarCases = useMemo(() => {
        let filtered = CASE_STUDIES.filter(p => p.category === cs.category && p.id !== cs.id);
        if (filtered.length < 2) { // 2 items for the case studies layout
            const padding = CASE_STUDIES.filter(p => p.id !== cs.id && !filtered.includes(p));
            filtered = [ ...filtered, ...padding ];
        }
        return filtered.slice(0, 2);
    }, [ cs.id, cs.category ]);

    return (
        <main className="flex flex-col w-full bg-white dark:bg-slate-950">

            {/* === HERO SECTION === */}
            <section className="relative w-full min-h-[60vh] flex flex-col justify-end pb-20 pt-32">
                <div className="absolute inset-0 z-0">
                    <Image src={cs.coverImage} alt={cs.title} fill priority className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A] via-[#00103A]/80 to-[#00103A]/30" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                        <Breadcrumbs items={[
                            { label: "Case Studies", href: "/case-studies" },
                            { label: cs.title.length > 30 ? cs.title.substring(0, 30) + '...' : cs.title, href: "#" }
                        ]} />

                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-[#FF5E14] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                                {cs.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                            {cs.title}
                        </h1>

                        <div className="flex items-center gap-3 text-slate-300 text-sm md:text-lg font-medium bg-white/10 backdrop-blur-md w-max px-5 py-2.5 rounded-full border border-white/20">
                            <Building2 className="w-5 h-5 text-[#FF5E14]" />
                            Client: <span className="text-white font-bold">{cs.client}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* === IMPACT & CHALLENGE HIGHLIGHTS === */}
            <section className="py-20 lg:py-24 border-b border-slate-100 dark:border-slate-800">
                <div className="mx-auto w-full max-w-5xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">

                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-[#00103A] dark:text-white">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#00103A] dark:text-white">The Challenge</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed pl-16">
                            {cs.challenge}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#FF5E14]/10 flex items-center justify-center text-[#FF5E14]">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#00103A] dark:text-white">Key Impact</h3>
                        </div>
                        <p className="text-[#FF5E14] text-3xl lg:text-4xl font-black pl-16">
                            {cs.impactHighlight}
                        </p>
                    </motion.div>

                </div>
            </section>

            {/* === CASE STUDY BODY === */}
            <section className="py-20">
                <div className="mx-auto w-full max-w-4xl px-6 lg:px-8">
                    <div className="text-lg text-slate-600 dark:text-slate-300 leading-loose space-y-8 font-serif">
                        <h3 className="text-3xl font-bold text-[#00103A] dark:text-white mb-6 font-sans">Our Strategic Approach</h3>
                        <p>
                            To overcome these rigorous hurdles, our engineering team implemented a multi-phased approach. We deployed advanced BIM (Building Information Modeling) technologies to predict structural stresses before excavation began.
                        </p>
                        <div className="grid grid-cols-2 gap-4 my-10 font-sans">
                            <Image src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop" alt="Construction" width={600} height={400} className="rounded-2xl object-cover h-64" />
                            <Image src="https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=800&auto=format&fit=crop" alt="Engineering" width={600} height={400} className="rounded-2xl object-cover h-64" />
                        </div>
                        <h3 className="text-3xl font-bold text-[#00103A] dark:text-white mt-12 mb-6 font-sans">The Final Result</h3>
                        <p>
                            The project was delivered ahead of schedule and under budget, ensuring minimal disruption to the surrounding environment and delivering maximum value to our client.
                        </p>
                    </div>
                </div>
            </section>

            {/* === SIMILAR CASE STUDIES === */}
            <SimilarCaseStudies cases={similarCases} />

            {/* === CTA === */}
            <CTA />

        </main>
    );
}