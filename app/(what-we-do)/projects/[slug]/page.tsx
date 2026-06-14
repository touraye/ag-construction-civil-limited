"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    MapPin, Calendar, Ruler, Building2, CheckCircle2,
    CircleDashed, Hammer, ExternalLink, Mail, Phone
} from "lucide-react";
import { FaLinkedinIn, FaXTwitter, FaInstagram, FaFacebookF } from "react-icons/fa6";

import { Project, PartnerSocial } from "@/types";
import { ALL_PROJECTS } from "@/data/projects"; // <--- SINGLE DATA SOURCE
import { DUMMY_PROJECT } from "@/data/projects"; // Assuming this is the detailed mockup we use for this example

// --- Extracted Components ---
import SimilarProjects from "@/components/project/similar-projects";
import ProjectCTA from "@/components/project/project-cta";

// --- Utility Functions ---
const renderSocialIcon = (social: PartnerSocial) => {
    const name = social.name.toLowerCase();
    if (name.includes("linkedin")) return <FaLinkedinIn className="w-4 h-4" />;
    if (name.includes("twitter") || name.includes("x")) return <FaXTwitter className="w-4 h-4" />;
    if (name.includes("instagram")) return <FaInstagram className="w-4 h-4" />;
    if (name.includes("facebook")) return <FaFacebookF className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateStr: string) => new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr));

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
    // 1. Get the current project
    // In production: const project = ALL_PROJECTS.find(p => p.slug === params.slug);
    const project: Project = DUMMY_PROJECT;

    // 2. Filter logic for Similar Projects (Single Data Source)
    const similarProjects = useMemo(() => {
        // Find projects of the same type, excluding the current one
        let filtered = ALL_PROJECTS.filter(
            (p) => p.type === project.type && p.id !== project.id
        );

        // If we don't have 3 of the same type, pad it with other recent projects
        if (filtered.length < 3) {
            const padding = ALL_PROJECTS.filter(
                (p) => p.id !== project.id && !filtered.includes(p)
            );
            filtered = [ ...filtered, ...padding ];
        }

        // Return exactly 3 projects for the UI grid
        return filtered.slice(0, 3);
    }, [ project.id, project.type ]);

    return (
        <main className="flex min-h-screen flex-col w-full bg-white dark:bg-slate-950">

            {/* === 1. CINEMATIC HERO SECTION === */}
            <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end pb-16 md:pb-24 pt-32">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={project.cover_img}
                        alt={project.name}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A] via-[#00103A]/60 to-transparent" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Status & Type Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-[#0056e0] text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                {project.type.replace('-', ' ')}
                            </span>
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border backdrop-blur-md ${project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                    project.status === 'in-progress' ? 'bg-[#FF5E14]/20 text-[#FF5E14] border-[#FF5E14]/30' :
                                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                                }`}>
                                {project.status.replace('-', ' ')}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                            {project.name}
                        </h1>

                        <div className="flex items-center gap-2 text-slate-300 md:text-lg">
                            <MapPin className="w-5 h-5 text-[#FF5E14]" />
                            {project.location}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* === 2. QUICK FACTS STRIP === */}
            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 lg:px-8 -mt-8 md:-mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                >
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                            <Building2 className="w-4 h-4 text-[#00103A]" /> Client
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{project.client || "Confidential"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                            <Ruler className="w-4 h-4 text-[#00103A]" /> Area
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{project.area_sqm?.toLocaleString()} sqm</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                            <Calendar className="w-4 h-4 text-[#00103A]" /> Commenced
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{formatDate(project.started_date)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                            Value
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{project.value_usd ? formatCurrency(project.value_usd) : "Undisclosed"}</span>
                    </div>
                </motion.div>
            </div>

            {/* === 3. CONTENT & TIMELINE GRID === */}
            <section className="py-20 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Col: Description, Tags, Gallery */}
                    <div className="lg:col-span-7 flex flex-col gap-16">
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Project Overview</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                {project.description}
                            </p>

                            {project.tags && (
                                <div className="flex flex-wrap gap-2 mt-8">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {project.gallery && project.gallery.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Project Gallery</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.gallery.map((img, idx) => (
                                        <div key={idx} className={`relative rounded-2xl overflow-hidden aspect-[4/3] group ${idx === 0 ? 'sm:col-span-2 aspect-[21/9]' : ''}`}>
                                            <Image src={img} alt={`${project.name} gallery ${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Live Timeline */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 sticky top-32">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Live Timeline</h3>
                            <p className="text-slate-500 text-sm mb-10">Transparent tracking of project milestones.</p>

                            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-10">
                                {project.timeline.map((phase, idx) => {
                                    const isCompleted = phase.status === 'completed';
                                    const isInProgress = phase.status === 'in-progress';

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-10%" }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={idx}
                                            className="relative pl-8"
                                        >
                                            <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F8FAFC] dark:border-slate-900 shadow-sm transition-colors ${isCompleted ? 'bg-emerald-500 text-white' :
                                                    isInProgress ? 'bg-[#FF5E14] text-white' :
                                                        'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                                                    isInProgress ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                                                            <Hammer className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    ) : <CircleDashed className="w-4 h-4" />}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                                    <h4 className={`text-lg font-bold ${isInProgress ? 'text-[#FF5E14]' : 'text-slate-900 dark:text-white'}`}>
                                                        {phase.phase}
                                                    </h4>
                                                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap bg-white dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                                                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                                    </span>
                                                </div>

                                                {phase.description && (
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2">
                                                        {phase.description}
                                                    </p>
                                                )}

                                                {isInProgress && (
                                                    <span className="inline-flex items-center gap-2 text-[#FF5E14] text-xs font-bold tracking-widest uppercase mt-4">
                                                        <span className="relative flex h-2.5 w-2.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5E14] opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5E14]"></span>
                                                        </span>
                                                        Active Phase
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* === 4. PROJECT PARTNERS === */}
            {project.partners && project.partners.length > 0 && (
                <section className="bg-slate-50 dark:bg-slate-900/50 py-20 lg:py-32 border-t border-slate-100 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Project Partners
                            </h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                                Monumental projects require extraordinary collaboration. We are proud to work alongside these industry-leading specialists.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.partners.map((partner, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={idx}
                                    className="bg-white dark:bg-slate-950 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[#0056e0] text-xs font-bold uppercase tracking-widest mb-1">
                                                {partner.role}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#FF5E14] transition-colors">
                                                {partner.name}
                                            </h3>
                                        </div>

                                        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                                            {partner.logo ? (
                                                <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-slate-300" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                        {partner.website && (
                                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#0056e0] transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {partner.contact_info && (
                                            <a href={partner.contact_info.includes('@') ? `mailto:${partner.contact_info}` : `tel:${partner.contact_info}`} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#0056e0] transition-colors">
                                                {partner.contact_info.includes('@') ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                                            </a>
                                        )}
                                        {partner.socials?.map((social, sIdx) => (
                                            <a key={sIdx} href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#0056e0] transition-colors">
                                                {renderSocialIcon(social)}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === 5. SIMILAR PROJECTS === */}
            <SimilarProjects projects={similarProjects} />

            {/* === 6. CALL TO ACTION === */}
            <ProjectCTA />

        </main>
    );
}