"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalNotFound() {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center bg-[#F5F7FA] dark:bg-slate-950 p-6">

            {/* Background massive '404' watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                <span className="text-[30vw] font-black text-slate-200/50 dark:text-slate-800/30 select-none">
                    404
                </span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 max-w-lg w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 md:p-14 text-center flex flex-col items-center"
            >
                {/* Animated Icon */}
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: [ 10, -10, 10 ] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-20 h-20 bg-[#FF5E14]/10 dark:bg-[#FF5E14]/20 rounded-full flex items-center justify-center mb-8"
                >
                    <Construction className="w-10 h-10 text-[#FF5E14]" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                    Page Not Found
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-sm md:text-base">
                    It looks like you&apos;ve wandered off the blueprint. The page you are looking for doesn&apos;t exist, has been moved, or you don&apos;t have access to it.
                </p>

                {/* Navigation Actions */}
                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="flex-1 h-12 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>

                    <Button
                        asChild
                        className="flex-1 h-12 bg-[#0056e0] hover:bg-[#0048c2] text-white shadow-lg"
                    >
                        <Link href="/portal/dashboard">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    </Button>
                </div>

            </motion.div>
        </div>
    );
}