"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Send } from "lucide-react";
import {
    FaFacebookF,
    FaXTwitter,    
    FaInstagram,
    FaTiktok
} from "react-icons/fa6";
import Image from "next/image";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

const watermarkVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1.5, ease: "easeOut" }
    },
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full bg-[#00103A] overflow-hidden flex flex-col">

            {/* === BACKGROUND LAYERS === */}

            {/* 1. AG CONSTRUCTIONS Watermark */}
            <div className="absolute inset-0 bottom-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                <motion.h1
                    variants={watermarkVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-[9vw] font-black text-white/[0.02] whitespace-nowrap"
                >
                    AG CONSTRUCTIONS
                </motion.h1>
            </div>

            {/* 2. Top Diagonal Striped Pattern */}
            <div
                className="absolute top-0 left-0 w-full h-12 opacity-20 pointer-events-none z-0"
                style={{
                    backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)",
                }}
            />

            {/* 3. Bottom Diagonal Striped Pattern (Sits just above the orange bar) */}
            <div
                className="absolute bottom-[60px] left-0 w-full h-12 opacity-20 pointer-events-none z-0" // 60px accounts for the solid orange bar height
                style={{
                    backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)",
                }}
            />

            {/* === MAIN FOOTER CONTENT === */}
            <div className="relative z-10 w-full mx-auto max-w-7xl px-6 md:px-8 pt-24 pb-16">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Let&apos;s <span className="text-[#FF5E14]">Connect</span> there
                    </h2>
                    <button className="bg-[#FF5E14] hover:bg-[#e8530e] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shrink-0">
                        Contact Us
                    </button>
                </motion.div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-16" />

                {/* 4-Column Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-5%" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
                >

                    {/* Column 1: Brand & Socials */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            {/* SVG Mockup of the "AG Construction" Logo icon */}
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 relative overflow-hidden">
                                {/* <div className="absolute left-2.5 bottom-2.5 w-4 h-6 bg-[#00103A]" />
                                <div className="absolute right-2.5 top-2.5 w-4 h-6 bg-[#FF5E14] rounded-tl-full" /> */}
                             <Image
                                src="/assets/AG-logo.jpeg" // Replace with your actual asset
                                alt="AG-CCC Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-2xl font-medium text-slate-400 uppercase tracking-wide">
                                    AG 
                                </span>
                                <span className="text-[#FF5E14] text-2xl leading-none">
                                    Construction
                                </span>
                            </div>
                        </Link>                           

                        <p className="text-slate-400 text-sm leading-relaxed pr-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-2">
                            {[
                                { icon: FaFacebookF, href: "#" },
                                { icon: FaXTwitter, href: "#" },                                
                                { icon: FaInstagram, href: "#" },
                                { icon: FaTiktok, href: "#" },
                            ].map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        whileHover={{ scale: 1.1, backgroundColor: "#FF5E14" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="w-9 h-9 rounded-full bg-[#11235A] text-white flex items-center justify-center transition-colors"
                                        aria-label={`Social link ${index}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Column 2: Navigation */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:pl-8">
                        <h3 className="text-xl font-bold text-white">Navigation</h3>
                        <ul className="flex flex-col gap-4">
                            {[ "Our Leadership", "Contact Us", "About Us", "Careers", "Case Studies" ].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                                        className="text-slate-400 hover:text-[#FF5E14] text-sm font-medium transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 3: Contact */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-white">Contact</h3>
                        <ul className="flex flex-col gap-5">
                            <li>
                                <a href="tel:+2203793900" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    (+220) 379-3900
                                </a>
                            </li>
                            <li>
                                <a href="mailto:agconstruction@gmail.com" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    agconstruction@gmail.com
                                </a>
                            </li>
                            <li className="text-slate-400 text-sm leading-relaxed">
                                2464 Royal Ln. Mesa,<br />
                                Jam City 45463
                            </li>
                        </ul>
                    </motion.div>

                    {/* Column 4: Newsletter */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-white">
                            Get the latest information
                        </h3>

                        <form className="relative flex w-full max-w-sm items-center mt-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                className="w-full bg-[#1A2859] text-white placeholder:text-slate-400 text-sm rounded-full py-3.5 pl-6 pr-14 outline-none focus:ring-2 focus:ring-[#FF5E14]/50 transition-all border border-transparent"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 bg-[#FF5E14] text-white w-12 flex items-center justify-center rounded-r-full hover:bg-[#e8530e] transition-colors"
                                aria-label="Subscribe"
                            >
                                <Send className="w-4 h-4 -ml-0.5" />
                            </motion.button>
                        </form>
                    </motion.div>

                </motion.div>
            </div>

            {/* === SOLID ORANGE BOTTOM BAR === */}
            <div className="relative z-10 w-full bg-[#FF5E14] py-5">
                <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/90 text-sm font-medium">
                    <p>
                        Copyright © {currentYear} AG Construction. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="hover:text-white transition-colors">
                            User Terms & Conditions
                        </Link>
                        <span className="w-px h-3 bg-white/40" />
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}