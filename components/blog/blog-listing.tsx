"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BLOG_POSTS, BlogCategory } from "@/data/blog";

const ITEMS_PER_PAGE = 6;

export default function BlogListing() {
    const [ activeCategory, setActiveCategory ] = useState<BlogCategory | "All">("All");
    const [ currentPage, setCurrentPage ] = useState(1);

    // Derive unique categories from data
    const categories = useMemo(() => {
        const cats = new Set(BLOG_POSTS.map(post => post.category));
        return [ "All", ...Array.from(cats) ] as (BlogCategory | "All")[];
    }, []);

    // Filter logic
    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter(post =>
            activeCategory === "All" ? true : post.category === activeCategory
        );
    }, [ activeCategory ]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [ filteredPosts, currentPage ]);

    // Handlers
    const handleCategoryChange = (category: BlogCategory | "All") => {
        setActiveCategory(category);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    return (
        <section className="relative w-full bg-[#F5F7FA] py-20 lg:py-32 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* === Filter Bar === */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00103A] tracking-tight shrink-0">
                        Latest <span className="text-[#FF5E14]">Articles</span>
                    </h2>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide snap-x">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
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
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px] content-start">
                    <AnimatePresence mode="popLayout">
                        {paginatedPosts.map((post) => (
                            <motion.article
                                layout
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 25 }}
                                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
                            >
                                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">

                                    {/* Image Container */}
                                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#FF5E14] shadow-sm">
                                            {post.category}
                                        </div>

                                        {/* Hover Arrow Overlay */}
                                        <div className="absolute inset-0 bg-[#00103A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-[#FF5E14] text-white flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out shadow-lg">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">

                                        {/* Meta Data */}
                                        <div className="flex items-center gap-4 text-slate-400 text-xs font-medium mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {post.readTime}
                                            </span>
                                        </div>

                                        {/* Title & Excerpt */}
                                        <h3 className="text-xl font-bold text-[#00103A] mb-3 group-hover:text-[#FF5E14] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        {/* Author / Read More Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                            <span className="text-[#00103A] font-semibold text-sm">
                                                By {post.author}
                                            </span>
                                            <span className="text-[#FF5E14] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read <ArrowUpRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>

                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* === Pagination === */}
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