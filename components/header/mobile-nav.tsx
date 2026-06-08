"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NAV_DATA } from "@/lib/nav-data";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    scrolled: boolean;
}


export function MobileNav({ isOpen, onClose, scrolled }: MobileNavProps) {
    // Prevent body scrolling when the menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [ isOpen ]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sliding Menu Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [ 0.22, 1, 0.36, 1 ] }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-white dark:bg-white shadow-2xl lg:hidden"
                    >
                        {/* Header / Close Button */}
                        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                            <span className="text-xl font-bold tracking-tight">Menu</span>
                            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close Menu">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Nav Links Container */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <Accordion type="single" collapsible className="w-full">
                                {NAV_DATA.map((section, idx) => (
                                    <motion.div
                                        key={section.title}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                                    >
                                        <AccordionItem value={`item-${idx}`} className="border-b-slate-100 dark:border-b-slate-800">
                                            <AccordionTrigger className="text-lg font-medium py-4">
                                                {section.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col space-y-3 pb-4">
                                                    {section.items.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            onClick={onClose}
                                                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </motion.div>
                                ))}
                            </Accordion>
                        </div>

                        {/* Mobile CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="p-6 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                        >
                            <Button
                                className="w-full bg-[#0056e0] hover:bg-[#0048c2] text-white h-12 text-base font-semibold group flex items-center gap-2"
                                asChild
                            >
                                <Link href="/contact" onClick={onClose}>
                                    Contact Us
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}