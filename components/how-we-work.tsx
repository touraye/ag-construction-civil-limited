"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";
import { ArrowRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS_DATA = [
	{
		id: 1,
		title: "Consultation & Planning",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
	},
	{
		id: 2,
		title: "Design & Construction",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
	},
	{
		id: 3,
		title: "Final Inspection & Handover",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...",
	},
];

export default function HowWeWork() {
	// --- Progression State ---
	const [ activeStep, setActiveStep ] = useState(1);
	const containerRef = useRef<HTMLDivElement>(null);

	// Detect when the steps grid comes into view
	const isInView = useInView(containerRef, { once: true, margin: "-10%" });

	// Sync the active step numbers precisely with the drawing of the blue line
	useEffect(() => {
		if (isInView) {
			// The line drawing is delayed by 0.6s to allow the initial fade-in to finish.
			// It takes 2 seconds total to draw across.
			// 0.6s + 1.0s = 1.6s (Reaches Step 2)
			// 0.6s + 2.0s = 2.6s (Reaches Step 3)
			const t1 = setTimeout(() => setActiveStep(2), 1600);
			const t2 = setTimeout(() => setActiveStep(3), 2600);

			return () => {
				clearTimeout(t1);
				clearTimeout(t2);
			};
		}
	}, [ isInView ]);

	// --- Framer Motion Entrance Variants ---
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2, delayChildren: 0.1 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
	};

	return (
		<section className="relative w-full bg-white dark:bg-slate-950 py-24 overflow-hidden transition-colors duration-300">

			{/* 1. Background Architectural Grid */}
			<div className="absolute inset-0 mx-auto max-w-7xl px-6 flex justify-between pointer-events-none z-0">
				<div className="w-px h-full bg-slate-100/60 dark:bg-slate-800/60" />
				<div className="w-px h-full bg-slate-100/60 dark:bg-slate-800/60 hidden md:block" />
				<div className="w-px h-full bg-slate-100/60 dark:bg-slate-800/60 hidden md:block" />
				<div className="w-px h-full bg-slate-100/60 dark:bg-slate-800/60" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

				{/* === Header Section === */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-10%" }}
					className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20"
				>
					<div>
						<motion.h2
							variants={itemVariants}
							className="text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white"
						>
							How We
							<br />
							<span className="text-slate-400 dark:text-slate-500">
								Get It Done
							</span>
						</motion.h2>
					</div>

					<motion.div
						variants={itemVariants}
						className="bg-white dark:bg-slate-900 p-1.5 rounded-full flex items-center shadow-sm border border-slate-100 dark:border-slate-800"
					>
						<button className="bg-[#0056e0] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0048c2] transition-colors">
							Learn More
						</button>
						<button
							aria-label="Learn More Arrow"
							className="bg-[#00103A] text-white w-10 h-10 rounded-full flex items-center justify-center ml-1 hover:bg-black transition-colors"
						>
							<ArrowRight className="w-4 h-4" />
						</button>
					</motion.div>
				</motion.div>

				{/* === Sequential Steps Grid Section === */}
				<div className="relative mt-12 md:mt-24" ref={containerRef}>

					{/* Static Background Horizontal Line */}
					<div className="hidden md:block absolute top-[18px] left-0 w-full h-px bg-slate-200 dark:bg-slate-800 z-0" />

					{/* Animated Blue Progression Line */}
					{/* Animates to 66.66% which lands exactly on the right edge of the 2nd column (reaching the final step) */}
					<motion.div
						initial={{ width: "0%" }}
						animate={isInView ? { width: "66.66%" } : { width: "0%" }}
						transition={{ duration: 2, ease: "linear", delay: 0.6 }}
						className="hidden md:block absolute top-[18px] left-0 h-[2px] bg-[#0056e0] z-0"
					/>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-50px" }}
						className="grid grid-cols-1 md:grid-cols-3 relative z-10"
					>
						{STEPS_DATA.map((step, index) => {
							const isLast = index === STEPS_DATA.length - 1;
							const stepNumber = index + 1;

							// Dynamic checks based on the auto-progressing state
							const isActive = stepNumber <= activeStep;
							const hasBlueConnector = stepNumber < activeStep;

							return (
								<motion.div
									key={step.id}
									variants={itemVariants}
									className="relative px-4 md:px-8 pb-12 md:pb-24 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 last:border-0"
								>
									{/* Step Pill */}
									<div className="h-9 flex items-center mb-6">
										<div
											className={cn(
												"text-[11px] font-bold tracking-widest uppercase px-4 py-2 relative z-10 inline-block transition-all duration-500",
												isActive
													? "bg-[#00103A] text-white rounded-full shadow-sm"
													: "text-[#00103A] dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 md:border-none"
											)}
										>
											STEP {step.id}
										</div>
									</div>

									{/* Step Content */}
									<h3
										className={cn(
											"text-2xl font-bold mb-4 leading-snug pr-4 transition-colors duration-500",
											isActive ? "text-[#00103A] dark:text-white" : "text-slate-400 dark:text-slate-600"
										)}
									>
										{step.title.split(" & ").map((part, i, arr) => (
											<React.Fragment key={part}>
												{part}
												{i !== arr.length - 1 && (
													<>
														{" "}
														<br className="hidden md:block" />&{" "}
													</>
												)}
											</React.Fragment>
										))}
									</h3>
									<p
										className={cn(
											"text-sm leading-relaxed pr-4 transition-colors duration-500",
											isActive ? "text-slate-500 dark:text-slate-400" : "text-slate-300 dark:text-slate-700"
										)}
									>
										{step.description}
									</p>

									{/* Desktop Connectors (>> arrows) */}
									{!isLast && (
										<div className="hidden md:flex absolute right-0 top-[18px] translate-x-1/2 -translate-y-1/2 z-20 bg-white dark:bg-slate-950 items-center justify-center transition-colors duration-500">
											<div
												className={cn(
													"w-8 h-8 flex items-center justify-center transition-all duration-500",
													hasBlueConnector
														? "bg-[#0056e0] text-white rounded-full shadow-md"
														: "text-[#00103A] dark:text-slate-400"
												)}
											>
												<ChevronsRight className={cn("transition-all", hasBlueConnector ? "w-5 h-5" : "w-6 h-6")} />
											</div>
										</div>
									)}
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</div>

			{/* Architectural Ruler Pattern Bottom Border */}
			<div
				className="absolute bottom-0 left-0 w-full h-[40px] border-b-[6px] border-[#00103A] dark:border-slate-800 z-10 opacity-70"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V20M10 40V30M20 40V30M30 40V30M40 40V30' stroke='%23cbd5e1' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
					backgroundRepeat: "repeat-x",
					backgroundPosition: "bottom",
				}}
			/>
		</section>
	);
}