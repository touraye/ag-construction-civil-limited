"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, ArrowRight } from "lucide-react";
import { BlogPost } from "@/data/blog";

export function SimilarBlogs({ blogs }: { blogs: BlogPost[] }) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="py-20 lg:py-32 bg-[#F5F7FA] dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#FF5E14] font-bold tracking-widest uppercase text-sm">More Insights</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#00103A] dark:text-white tracking-tight">
                            Related <span className="text-[#FF5E14]">Articles</span>
                        </h2>
                    </div>
                    <Link href="/blogs" className="hidden md:flex items-center gap-2 text-[#FF5E14] font-bold hover:text-[#FF4500] transition-colors group">
                        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800"
                        >
                            <Link href={`/blogs/${post.slug}`} className="flex flex-col h-full">
                                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                    <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#FF5E14] shadow-sm">{post.category}</div>
                                    <div className="absolute inset-0 bg-[#00103A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-[#FF5E14] text-white flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out shadow-lg">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-medium mb-4">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00103A] dark:text-white mb-3 group-hover:text-[#FF5E14] transition-colors line-clamp-2">{post.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}