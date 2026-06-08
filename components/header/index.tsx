"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useScroll } from "@/hooks/use-scroll";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";

// Utility for clean class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Header() {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
    const { scrolled, direction } = useScroll();

    // Auto-hide calculation
    const isHidden = direction === "down" && scrolled && !mobileMenuOpen;

    return (
        <>
            <motion.header
                initial="visible"
                animate={isHidden ? "hidden" : "visible"}
                variants={{
                    hidden: { y: "-100%" },
                    visible: { y: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn(
                    "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
                    scrolled
                        ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
                        : "bg-transparent border-transparent text-white lg:text-inherit"
                    // NOTE: Modify the text colors above based on whether your hero video requires white text initially.
                )}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                    {/* 1. Logo (Left Column) */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 relative z-50">
                            <span className="sr-only">AG-CCC</span>
                            {/* Example implementation of Next.js Image for the logo */}
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/assets/AG-logo.jpeg" // Replace with your actual asset
                                    alt="AG-CCC Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                                {/* Fallback inline SVG to match the provided AG-CCC design for testing */}
                                <div className="hidden absolute inset-0 text-[#00103A] z-10 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-8 h-8">
                                        <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 85C30.7 85 15 69.3 15 50S30.7 15 50 15s35 15.7 35 35-15.7 35-35 35z" />
                                        <path d="M70 30L30 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <span className={cn(
                                "text-2xl font-bold tracking-tight transition-colors text-white",
                                scrolled ? "text-slate-900 dark:text-white" : "text-white dark:text-white" // Adjust if hero is dark
                            )}>
                                AG-CCL
                            </span>
                        </Link>
                    </div>

                    {/* 2. Desktop Navigation (Center Column) */}
                    <div className="hidden lg:flex lg:justify-center">
                        <DesktopNav scrolled={scrolled} />
                    </div>

                    {/* 3. CTA & Mobile Toggle (Right Column) */}
                    <div className="flex flex-1 justify-end items-center gap-4 z-50">
                        {/* Desktop CTA */}
                        <Button
                            className="hidden lg:flex bg-[#00103A] hover:bg-[#00103A]/90 text-white px-6 py-[1.2rem] text-base font-semibold tracking-wide shadow-medium rounded-md transition-all group items-center gap-2"
                            asChild
                        >
                            <Link href="/contact">
                                Contact Us
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                        {/* Mobile Hamburger Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open main menu"
                        >
                            <Menu className={cn(
                                "h-6 w-6",
                                scrolled ? "text-slate-900 dark:text-white" : "text-white dark:text-white"
                            )} />
                        </Button>
                    </div>

                </div>
            </motion.header>

            {/* Mobile Drawer Overlay */}
            <MobileNav
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                scrolled={scrolled}
            />
        </>
    );
}