"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { OPEN_ROLES } from "@/data/careers";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function OpenRoles() {
    return (
        <section id="open-roles" className="relative w-full bg-[#F5F7FA] py-24 overflow-hidden">
            <div className="mx-auto max-w-5xl px-6 md:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
                                Open Positions
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#00103A]">
                            Find Your <span className="text-[#FF5E14]">Next Role</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-sm md:text-right">
                        Don&apos;t see a perfect match? Send us your resume anyway. We are always looking for exceptional talent.
                    </p>
                </motion.div>

                {/* Roles Grouped by Department */}
                <div className="flex flex-col gap-12">
                    {OPEN_ROLES.map((department, depIndex) => (
                        <motion.div
                            key={depIndex}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-10%" }}
                        >
                            <motion.h3
                                variants={itemVariants}
                                className="text-2xl font-bold text-[#00103A] mb-6 border-b border-slate-200 pb-4"
                            >
                                {department.department}
                            </motion.h3>

                            <div className="flex flex-col gap-4">
                                {department.jobs.map((job) => (
                                    <motion.div key={job.id} variants={itemVariants}>
                                        <Link
                                            href={`/careers/${job.id}`}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300"
                                        >
                                            <div className="flex flex-col mb-4 md:mb-0">
                                                <h4 className="text-xl font-bold text-[#00103A] group-hover:text-[#FF5E14] transition-colors mb-2">
                                                    {job.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {job.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-[#00103A] font-bold text-sm hidden md:block opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    Apply Now
                                                </span>
                                                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center group-hover:bg-[#FF5E14] group-hover:text-white text-[#00103A] transition-colors duration-300">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}