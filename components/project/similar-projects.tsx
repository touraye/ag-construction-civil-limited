"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import { Project, ProjectStatus } from "@/types";

// Helper functions (kept locally for this component)
const formatType = (type: string) => type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
        case "completed":
            return { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20", label: "Completed" };
        case "in-progress":
            return { bg: "bg-[#FF5E14]/10", text: "text-[#FF5E14]", border: "border-[#FF5E14]/20", label: "In Progress" };
        case "not-started":
            return { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/20", label: "Upcoming" };
        default:
            return { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/20", label: "Upcoming" };
    }
};

interface SimilarProjectsProps {
    projects: Project[];
}

export default function SimilarProjects({ projects }: SimilarProjectsProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="py-20 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">
                                Portfolio
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Similar <span className="text-[#FF5E14]">Projects</span>
                        </h2>
                    </div>
                    <Link
                        href="/projects#project-list"
                        className="hidden md:flex items-center gap-2 text-[#FF5E14] font-bold hover:text-[#e8530e] transition-colors group"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((proj, idx) => {
                        const statusConfig = getStatusConfig(proj.status);
                        return (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-slate-100 dark:border-slate-800"
                            >
                                <Link href={`/projects/${proj.slug}`} className="flex flex-col h-full cursor-pointer">

                                    {/* Image Container */}
                                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <Image
                                            src={proj.cover_img}
                                            alt={proj.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />

                                        <div className="absolute inset-0 bg-[#00103A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-[#FF5E14] text-white flex items-center justify-center translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-lg">
                                                <ArrowUpRight className="w-6 h-6" />
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                            {statusConfig.label}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[#FF5E14] text-xs font-bold tracking-widest uppercase">
                                                {formatType(proj.type)}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                                <MapPin className="w-3.5 h-3.5" />{proj.location}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#00103A] dark:text-white mb-2 group-hover:text-[#FF5E14] transition-colors">
                                            {proj.name}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                            {proj.description}
                                        </p>
                                    </div>

                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}