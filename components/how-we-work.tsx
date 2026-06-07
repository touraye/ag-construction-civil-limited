'use client'

import React from 'react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ChevronsRight } from 'lucide-react'

const STEPS_DATA = [
	{
		id: 1,
		title: 'Consultation & Planning',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...',
		isActive: true, // Rendered as the solid blue pill
	},
	{
		id: 2,
		title: 'Design & Construction',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
		isActive: false, // Rendered as transparent text
	},
	{
		id: 3,
		title: 'Final Inspection & Handover',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
		isActive: false,
	},
]

export default function HowWeWork() {
	// Framer Motion Variants for Staggered Entrance
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
				delayChildren: 0.2,
			},
		},
	}

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: 'easeOut' },
		},
	}

	return (
		<section className='relative w-full bg-white py-24 overflow-hidden'>
			{/* 
        1. Background Architectural Grid 
        These match the faint vertical lines seen in the design 
      */}
			<div className='absolute inset-0 mx-auto max-w-7xl px-6 flex justify-between pointer-events-none z-0'>
				<div className='w-px h-full bg-slate-100/60' />
				<div className='w-px h-full bg-slate-100/60 hidden md:block' />
				<div className='w-px h-full bg-slate-100/60 hidden md:block' />
				<div className='w-px h-full bg-slate-100/60' />
			</div>

            <div className='relative z-10 mx-auto max-w-7xl px-6 lg:px-8'>
				{/* === Header Section === */}
				<div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20'>
					<div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className='flex items-center gap-4 mb-4'></motion.div>

						{/* <motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight'>
							<span className='text-[#00103A]'>How We </span>
							<span className='text-[#0056e0]'>Get It Done</span>
						</motion.h2> */}

						<motion.h2
							variants={itemVariants}
							className='text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white '>
                            How We
							<br />
							<span className='text-slate-400'>
                                Get It Done
							</span>
						</motion.h2>
					</div>

					{/* Grouped CTA Button */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className='bg-white p-1.5 rounded-full flex items-center shadow-sm border border-slate-100'>
						<button className='bg-[#0056e0] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0048c2] transition-colors'>
							Learn More
						</button>
						<button
							aria-label='Learn More Arrow'
							className='bg-[#00103A] text-white w-10 h-10 rounded-full flex items-center justify-center ml-1 hover:bg-black transition-colors'>
							<ArrowRight className='w-4 h-4' />
						</button>
					</motion.div>
				</div>

				{/* === Steps Grid Section === */}
				<div className='relative mt-12 md:mt-24'>
					{/* Static Background Horizontal Line */}
					<div className='hidden md:block absolute top-[18px] left-0 w-full h-px bg-slate-200 z-0' />

					{/* Animated Orange Progression Line (Reaches Step 2) */}
					<motion.div
						initial={{ width: '0%' }}
						whileInView={{ width: '33.33%' }} // Animates exactly to the orange connector
						transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
						viewport={{ once: true }}
						className='hidden md:block absolute top-[18px] left-0 h-[2px] bg-[#0056e0] z-0'
					/>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-50px' }}
						className='grid grid-cols-1 md:grid-cols-3 relative z-10'>
						{STEPS_DATA.map((step, index) => {
							const isLast = index === STEPS_DATA.length - 1
							const hasOrangeConnector = index === 0

							return (
								<motion.div
									key={step.id}
									variants={itemVariants}
									className='relative px-4 md:px-8 pb-12 md:pb-24 border-b md:border-b-0 md:border-r border-slate-100 last:border-0'>
									{/* Step Pill / Text */}
									<div className='h-9 flex items-center mb-6'>
										{step.isActive ? (
											<div className='bg-[#00103A] text-white text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full relative z-10 inline-block shadow-sm'>
												STEP {step.id}
											</div>
										) : (
											<div className='text-[#00103A] bg-white text-[11px] font-bold tracking-widest uppercase px-4 py-2 relative z-10 inline-block'>
												STEP {step.id}
											</div>
										)}
									</div>

									{/* Step Content */}
									<h3 className='text-2xl font-bold text-[#00103A] mb-4 leading-snug pr-4'>
										{/* Replaces spaces around ampersand with a forced break for visual matching */}
										{step.title.split(' & ').map((part, i, arr) => (
											<React.Fragment key={part}>
												{part}
												{i !== arr.length - 1 && (
													<>
														{' '}
														<br className='hidden md:block' />&{' '}
													</>
												)}
											</React.Fragment>
										))}
									</h3>
									<p className='text-slate-500 text-sm leading-relaxed pr-4'>
										{step.description}
									</p>

									{/* Desktop Connectors (>> arrows) */}
									{!isLast && (
										<div className='hidden md:flex absolute right-0 top-[18px] translate-x-1/2 -translate-y-1/2 z-20 bg-white items-center justify-center'>
											{hasOrangeConnector ? (
												<div className='bg-[#0056e0] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md'>
													<ChevronsRight className='w-5 h-5' />
												</div>
											) : (
												<div className='text-[#00103A] w-8 h-8 flex items-center justify-center'>
													<ChevronsRight className='w-6 h-6' />
												</div>
											)}
										</div>
									)}
								</motion.div>
							)
						})}
					</motion.div>
				</div>
			</div>

			{/* === Bottom Graphics (Excavator & Ruler) === */}

			{/* 
        Excavator Image 
        Replace '/excavator-placeholder.png' with your transparent PNG 
      */}
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				viewport={{ once: true }}
				className='absolute bottom-10 left-4 md:left-12 w-48 h-48 md:w-72 md:h-72 z-20 pointer-events-none'>
				{/* <Image
                    src="/excavator-placeholder.png" // Insert your cutout PNG here
                    alt="Construction Excavator"
                    fill
                    className="object-contain object-bottom"
                /> */}
			</motion.div>

			{/* Architectural Ruler Pattern Bottom Border */}
			<div
				className='absolute bottom-0 left-0 w-full h-[40px] border-b-[6px] border-[#00103A] z-10 opacity-70'
				style={{
					// Custom inline SVG generates the exact upward-facing ruler ticks
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V20M10 40V30M20 40V30M30 40V30M40 40V30' stroke='%23cbd5e1' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
					backgroundRepeat: 'repeat-x',
					backgroundPosition: 'bottom',
				}}
			/>
		</section>
	)
}
