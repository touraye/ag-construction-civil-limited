"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Home, Building2, Factory, Store, ArrowUpRight } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// 1. Data & Types Definition
// ----------------------------------------------------------------------

export type ServiceData = {
    id: string;
    title: string;
    icon: React.ElementType;
    description: string;
    images: {
        primary: string; // Taller left image
        secondary: string; // Wider right image
    };
    link: string;
};

const SERVICES_DATA: ServiceData[] = [
    {
        id: "residential",
        title: "Residential Roofing",
        icon: Home,
        description:
            "Our roofing services are designed to deliver durable, long-lasting protection with minimal hassle. From inspections to installations.",
        images: {
            primary: "/assets/image/img-tall.jpg", // Placeholder: Drill/Worker
            secondary: "/assets/image/img-short.jpg", // Placeholder: Roof worker
        },
        link: "/services/residential",
    },
    {
        id: "commercial",
        title: "Commercial Roofing",
        icon: Building2,
        description:
            "Comprehensive commercial roofing solutions tailored for businesses, ensuring maximum durability, energy efficiency, and minimal downtime.",
        images: {
            primary: "/assets/image/img-tall.jpg", // Placeholder: Drill/Worker
            secondary: "/assets/image/img-short.jpg", // Placeholder: Roof worker
        },
        link: "/services/commercial",
    },
    {
        id: "industrial",
        title: "Industrial Roofing",
        icon: Factory,
        description:
            "Heavy-duty industrial roofing systems built to withstand harsh environments, extreme temperatures, and chemical exposures.",
        images: {
            primary: "/assets/image/img-tall.jpg", // Placeholder: Drill/Worker
            secondary: "/assets/image/img-short.jpg", // Placeholder: Roof worker
        },
        link: "/services/industrial",
    },
    {
        id: "retail",
        title: "Retail Roofing",
        icon: Store,
        description:
            "Aesthetic and highly functional roofing for retail spaces that protects your inventory while enhancing your building's curb appeal.",
        images: {
            primary: "/assets/image/img-tall.jpg", // Placeholder: Drill/Worker
            secondary: "/assets/image/img-short.jpg", // Placeholder: Roof worker
        },
        link: "/services/retail",
    },
];

// ----------------------------------------------------------------------
// 2. Framer Motion Variants
// ----------------------------------------------------------------------

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 },
    },
};

const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [ 0.22, 1, 0.36, 1 ] },
    },
    exit: {
        opacity: 0,
        y: -40,
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

// ----------------------------------------------------------------------
// 3. Main Component
// ----------------------------------------------------------------------

export default function Services() {
    const [ activeServiceId, setActiveServiceId ] = useState<string>(
        SERVICES_DATA[ 0 ].id
    );

    const activeService =
        SERVICES_DATA.find((s) => s.id === activeServiceId) || SERVICES_DATA[ 0 ];

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="w-full bg-[#F8FAFC] py-20 lg:py-32 dark:bg-slate-950"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* === Desktop & Tablet Layout (Hidden on Mobile) === */}
                <div className="hidden lg:grid lg:grid-cols-12 lg:gap-16 items-start">

                    {/* Left Column: Headers & Tabs */}
                    <motion.div variants={sectionVariants} className="lg:col-span-4 flex flex-col">
                        <div className="mb-10">
                            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white">
                                Construction <br />
                                <span className="text-slate-400">Services</span>
                            </h2>
                            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xs text-base">
                                Professional roofing solutions for every type of building
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-slate-800">
                            {SERVICES_DATA.map((service) => {
                                const isActive = activeServiceId === service.id;
                                const Icon = service.icon;

                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => setActiveServiceId(service.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group",
                                            isActive
                                                ? "bg-blue-50/50 dark:bg-blue-500/10"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Icon
                                                className={cn(
                                                    "w-5 h-5 transition-colors",
                                                    isActive ? "text-[#0056e0]" : "text-slate-400"
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    "font-semibold text-base transition-colors",
                                                    isActive
                                                        ? "text-[#0056e0]"
                                                        : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                                )}
                                            >
                                                {service.title}
                                            </span>
                                        </div>
                                        <ArrowUpRight
                                            className={cn(
                                                "w-5 h-5 transition-colors",
                                                isActive ? "text-[#0056e0]" : "text-slate-300 dark:text-slate-600"
                                            )}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Right Column: Dynamic Content & Images */}
                    <div className="lg:col-span-8 relative min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService.id}
                                variants={slideUpVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col"
                            >
                                {/* Masonry-style Images Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-10 items-start">
                                    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-sm">
                                        <Image
                                            src={activeService.images.primary}
                                            alt={`${activeService.title} primary`}
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                    <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-sm mt-16">
                                        <Image
                                            src={activeService.images.secondary}
                                            alt={`${activeService.title} secondary`}
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-w-2xl">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        {activeService.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                        {activeService.description}
                                    </p>
                                    <Link
                                        href={activeService.link}
                                        className="inline-flex items-center text-sm font-bold tracking-widest text-[#0056e0] uppercase hover:text-[#0048c2] transition-colors"
                                    >
                                        View Service
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* === Mobile Layout: Accordion (Visible only on Mobile) === */}
                <div className="block lg:hidden">
                    <div className="mb-8">
                        <h2 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white">
                            Construction <br />
                            <span className="text-slate-400">Services</span>
                        </h2>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                            Professional roofing solutions for every type of building
                        </p>
                    </div>

                    <Accordion
                        type="single"
                        defaultValue={SERVICES_DATA[ 0 ].id}
                        className="w-full bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border dark:border-slate-800"
                    >
                        {SERVICES_DATA.map((service) => {
                            const Icon = service.icon;
                            return (
                                <AccordionItem
                                    key={service.id}
                                    value={service.id}
                                    className="border-none"
                                >
                                    <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]>div>svg]:text-[#3b82f6] [&[data-state=open]>div>span]:text-[#3b82f6]">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-slate-400 transition-colors" />
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                                                {service.title}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-6 pt-2">
                                        <motion.div
                                            variants={slideUpVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="flex flex-col gap-6"
                                        >
                                            {/* Mobile Images Stack */}
                                            <div className="flex flex-col gap-4">
                                                <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
                                                    <Image
                                                        src={service.images.primary}
                                                        alt={service.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Mobile Content */}
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                                    {service.description}
                                                </p>
                                                <Link
                                                    href={service.link}
                                                    className="inline-flex items-center text-xs font-bold tracking-widest text-[#3b82f6] uppercase"
                                                >
                                                    View Service
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>

            </div>
        </motion.section>
    );
}