"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, ArrowUpRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjectType, ProjectStatus } from "@/types";

const ITEMS_PER_PAGE = 6;

// --- Helpers ---
const formatType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
        case "completed":
            return { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20", label: "Completed" };
        case "in-progress":
            return { bg: "bg-[#FF5E14]/10", text: "text-[#FF5E14]", border: "border-[#FF5E14]/20", label: "In Progress" };
        case "not-started":
            return { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/20", label: "Upcoming" };
    }
};

export default function ProjectsListing() {
    // --- State for Multiple Filters ---
    const [ filters, setFilters ] = useState({
        type: "all" as ProjectType | "all",
        status: "all" as ProjectStatus | "all",
        location: "all",
    });
    const [ currentPage, setCurrentPage ] = useState(1);

    // --- Derive Available Options from Data ---
    const availableTypes = useMemo(() => {
        const types = new Set(ALL_PROJECTS.map((p) => p.type));
        return [ "all", ...Array.from(types) ] as (ProjectType | "all")[];
    }, []);

    const availableLocations = useMemo(() => {
        const locations = new Set(ALL_PROJECTS.map((p) => p.location));
        return [ "all", ...Array.from(locations) ];
    }, []);

    // --- Filtering Logic ---
    const filteredProjects = useMemo(() => {
        return ALL_PROJECTS.filter((project) => {
            const matchType = filters.type === "all" || project.type === filters.type;
            const matchStatus = filters.status === "all" || project.status === filters.status;
            const matchLocation = filters.location === "all" || project.location === filters.location;

            return matchType && matchStatus && matchLocation;
        });
    }, [ filters ]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [ filteredProjects, currentPage ]);

    // --- Handlers ---
    const updateFilter = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [ key ]: value }));
        setCurrentPage(1); // Always reset to page 1 when filtering changes
    };

    const clearFilters = () => {
        setFilters({ type: "all", status: "all", location: "all" });
        setCurrentPage(1);
    };

    const hasActiveFilters = filters.type !== "all" || filters.status !== "all" || filters.location !== "all";

    return (
        <section id="project-list" className="relative w-full bg-[#F5F7FA] py-20 lg:py-32 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* === FILTER SECTION === */}
                <div className="flex flex-col gap-6 mb-12">

                    {/* Top Row: Title & Dropdown Filters */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#00103A] tracking-tight shrink-0">
                            Explore <span className="text-[#FF5E14]">Projects</span>
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

                            {/* Location Dropdown */}
                            <div className="relative group min-w-[160px] flex-1 md:flex-none">
                                <select
                                    value={filters.location}
                                    onChange={(e) => updateFilter("location", e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5E14]/50 focus:border-[#FF5E14] cursor-pointer transition-all shadow-sm"
                                >
                                    <option value="all">All Locations</option>
                                    {availableLocations.filter(l => l !== "all").map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-[#FF5E14] transition-colors" />
                            </div>

                            {/* Status Dropdown */}
                            <div className="relative group min-w-[160px] flex-1 md:flex-none">
                                <select
                                    value={filters.status}
                                    onChange={(e) => updateFilter("status", e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5E14]/50 focus:border-[#FF5E14] cursor-pointer transition-all shadow-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="not-started">Upcoming</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-[#FF5E14] transition-colors" />
                            </div>

                            {/* Clear Filters Button (Only shows if a filter is active) */}
                            <AnimatePresence>
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                        onClick={clearFilters}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-[#FF5E14] hover:text-[#00103A] transition-colors whitespace-nowrap"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Reset
                                    </motion.button>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>

                    {/* Bottom Row: Type Pills (Horizontal Scroll) */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-hide snap-x">
                        {availableTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => updateFilter("type", type)}
                                className={`snap-center shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filters.type === type
                                        ? "bg-[#00103A] text-white shadow-md"
                                        : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200"
                                    }`}
                            >
                                {type === "all" ? "All Categories" : formatType(type)}
                            </button>
                        ))}
                    </div>

                </div>

                {/* === ANIMATED PROJECT GRID === */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px] content-start">
                    <AnimatePresence mode="popLayout">
                        {paginatedProjects.map((project) => {
                            const statusConfig = getStatusConfig(project.status);

                            return (
                                <motion.div
                                    layout
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 25 }}
                                    className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-slate-100"
                                >
                                    <Link href={`/projects/${project.slug}`} className="flex flex-col h-full cursor-pointer">

                                        {/* Image Container */}
                                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                            <Image
                                                src={project.cover_img}
                                                alt={project.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />

                                            {/* Dark overlay & Hover Action Arrow */}
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
                                                    {formatType(project.type)}
                                                </span>
                                                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {project.location}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-[#00103A] mb-2 group-hover:text-[#FF5E14] transition-colors">
                                                {project.name}
                                            </h3>

                                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* === EMPTY STATE === */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="w-full py-20 flex flex-col items-center text-center bg-white rounded-3xl border border-slate-100 shadow-sm mt-8"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <SlidersHorizontal className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#00103A] mb-2">No projects found</h3>
                        <p className="text-slate-500 mb-6">We couldn&apos;t find any projects matching your current filters.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#00103A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#FF5E14] transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}

                {/* === PAGINATION === */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-[#00103A] hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${currentPage === pageNum
                                                ? "bg-[#FF5E14] text-white shadow-md"
                                                : "text-slate-500 hover:bg-slate-200"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-[#00103A] hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}