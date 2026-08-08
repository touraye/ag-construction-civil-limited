"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SimilarBlogs } from "@/components/blog/similar-blogs";
import CTA  from "@/components/shared/cta";
import { BLOG_POSTS, BlogPost } from "@/data/blog";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    // Mock finding the article
    const post: BlogPost = BLOG_POSTS[ 0 ]; // Replace with: BLOG_POSTS.find(p => p.slug === params.slug)

    // Smart Filtering for Similar Blogs
    const similarBlogs = useMemo(() => {
        let filtered = BLOG_POSTS.filter(p => p.category === post.category && p.id !== post.id);
        if (filtered.length < 3) {
            const padding = BLOG_POSTS.filter(p => p.id !== post.id && !filtered.includes(p));
            filtered = [ ...filtered, ...padding ];
        }
        return filtered.slice(0, 3);
    }, [ post.id, post.category ]);

    return (
        <main className="flex flex-col w-full bg-white dark:bg-slate-950">

            {/* === HERO SECTION === */}
            <section className="relative w-full min-h-[60vh] flex flex-col justify-end pb-20 pt-32">
                <div className="absolute inset-0 z-0">
                    <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A] via-[#00103A]/80 to-[#00103A]/40" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-4xl px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                        <Breadcrumbs items={[
                            { label: "Blogs", href: "/blogs" },
                            { label: post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title, href: "#" }
                        ]} />

                        <div className="inline-block px-4 py-1.5 bg-[#FF5E14] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                            {post.category}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-[#FF5E14]" /> {post.author}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#FF5E14]" /> {post.date}</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF5E14]" /> {post.readTime}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* === ARTICLE BODY === */}
            <section className="py-20 lg:py-24">
                <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">
                    <div className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-loose space-y-8 font-serif">
                        {/* Simulated rich text content */}
                        <p className="text-2xl text-[#00103A] dark:text-white font-medium leading-relaxed mb-10">
                            {post.excerpt}
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                        <h3 className="text-3xl font-bold text-[#00103A] dark:text-white mt-12 mb-6">The Future of Materials</h3>
                        <p>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                        <div className="my-12 p-8 border-l-4 border-[#FF5E14] bg-slate-50 dark:bg-slate-900 rounded-r-2xl">
                            <p className="text-xl font-medium text-[#00103A] dark:text-white italic">
                                &quot;Innovation in construction is no longer just about building taller; it&apos;s about building smarter, greener, and more resilient communities for future generations.&quot;
                            </p>
                            <span className="block mt-4 text-[#FF5E14] font-bold">— {post.author}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* === SIMILAR BLOGS === */}
            <SimilarBlogs blogs={similarBlogs} />

            {/* === CTA === */}
            <CTA />

        </main>
    );
}