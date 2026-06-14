import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-8 w-full">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-300">
                <li>
                    <Link href="/" className="flex items-center hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                            {isLast ? (
                                <span className="text-[#FF5E14] pointer-events-none" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href} className="hover:text-white transition-colors">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}