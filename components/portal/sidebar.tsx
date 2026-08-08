"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/context/portal-auth-context";
import { PORTAL_LINKS } from "@/lib/constants/portal-links";



export function Sidebar() {
    const pathname = usePathname();
    const { user } = usePortalAuth()
    // Filter links down to only those the current user's role can see
    const visibleLinks = PORTAL_LINKS.filter(link =>
        link.roles.includes(user.role)
    )

    return (
        <div className="flex h-full flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">

            {/* Brand Logo */}
            <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <Link href="/portal/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00103A] dark:bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute left-1.5 bottom-1.5 w-2 h-3.5 bg-white dark:bg-[#00103A]" />
                        <div className="absolute right-1.5 top-1.5 w-2 h-3.5 bg-[#FF5E14] rounded-tl-full" />
                    </div>
                    <span className="text-xl font-bold text-[#00103A] dark:text-white tracking-tight">
                        AG Constructions<span className="text-[#FF5E14]">.</span>
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="mb-4 px-2 text-xs font-semibold text-slate-400 tracking-widest uppercase">
                    Menu
                </div>
                {visibleLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[#FF5E14]/10 text-[#FF5E14] dark:bg-[#FF5E14]/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}

                {/* System / Settings placed at the bottom visually */}
                <div className="mt-8 mb-4 px-2 text-xs font-semibold text-slate-400 tracking-widest uppercase">
                    System
                </div>
                <Link
                    href="/portal/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        pathname.startsWith("/portal/settings")
                            ? "bg-[#FF5E14]/10 text-[#FF5E14]"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </nav>

        </div>
    );
}