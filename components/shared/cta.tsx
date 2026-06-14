"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 lg:py-32 px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] bg-[#00103A] overflow-hidden shadow-2xl p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10"
            >
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
                />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF5E14] rounded-full blur-[100px] opacity-40 pointer-events-none" />

                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Ready to start your <span className="text-[#FF5E14]">next project?</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-xl">
                        Let&apos;s discuss how our engineering expertise and commitment to quality can bring your vision to life.
                    </p>
                </div>

                <Link
                    href="/contact"
                    className="relative z-10 shrink-0 bg-[#FF5E14] hover:bg-[#e8530e] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-[#FF5E14]/25 flex items-center gap-2 group"
                >
                    Request Consultation
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>
        </section>
    );
}