'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion, Variants } from 'framer-motion'
import { Project } from '@/types' // Adjust path
import { FEATURED_PROJECTS } from '@/data/projects' // Adjust path

// --- Framer Motion Variants ---

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
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

const cardEntranceVariants: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
	},
}

const imageVariants: Variants = {
	rest: { scale: 1 },
	hover: { scale: 1.05, transition: { duration: 0.7, ease: 'easeOut' } },
}

const contentRevealVariants: Variants = {
	rest: { y: 24 },
	hover: { y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const textRevealVariants: Variants = {
	rest: { opacity: 0, height: 0, marginTop: 0 },
	hover: {
		opacity: 1,
		height: 'auto',
		marginTop: 8,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
}

const buttonScaleVariants: Variants = {
	rest: { scale: 1 },
	hover: {
		scale: 1.1,
		transition: { type: 'spring', stiffness: 400, damping: 17 },
	},
}

export default function FeaturedProjects() {
	const scrollContainerRef = React.useRef<HTMLDivElement>(null)

	// States for custom scrollbar and pagination
	const [scrollProgress, setScrollProgress] = React.useState(0)
	const [firstVisible, setFirstVisible] = React.useState(1)
	const [lastVisible, setLastVisible] = React.useState(4)
	const totalItems = FEATURED_PROJECTS.length

	const updateScrollState = React.useCallback(() => {
		if (!scrollContainerRef.current) return

		const { scrollLeft, scrollWidth, clientWidth, children } =
			scrollContainerRef.current

		// 1. Calculate Progress Bar Width (0 to 100%)
		const maxScroll = scrollWidth - clientWidth
		const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
		setScrollProgress(progress)

		// 2. Calculate Visible Items for "1 - 4 of X" text
		let first = 0
		let visibleCount = 0

		const containerLeft =
			scrollContainerRef.current.getBoundingClientRect().left
		const containerRight =
			scrollContainerRef.current.getBoundingClientRect().right

		Array.from(children).forEach((child, index) => {
			const rect = child.getBoundingClientRect()
			if (
				rect.left >= containerLeft - 10 &&
				rect.right <= containerRight + 10
			) {
				if (visibleCount === 0) first = index + 1
				visibleCount++
			}
		})

		if (visibleCount > 0) {
			setFirstVisible(first)
			setLastVisible(Math.min(first + visibleCount - 1, totalItems))
		}
	}, [totalItems])

	React.useEffect(() => {
		const container = scrollContainerRef.current
		if (container) {
			container.addEventListener('scroll', updateScrollState)
			window.addEventListener('resize', updateScrollState)
			setTimeout(updateScrollState, 100)
		}
		return () => {
			if (container) container.removeEventListener('scroll', updateScrollState)
			window.removeEventListener('resize', updateScrollState)
		}
	}, [updateScrollState])

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const itemWidth = scrollContainerRef.current.children[0].clientWidth
			scrollContainerRef.current.scrollBy({
				left: -itemWidth,
				behavior: 'smooth',
			})
		}
	}

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const itemWidth = scrollContainerRef.current.children[0].clientWidth
			scrollContainerRef.current.scrollBy({
				left: itemWidth,
				behavior: 'smooth',
			})
		}
	}

	return (
		<section className='w-full py-16 bg-white overflow-hidden'>
			<div className='mx-auto px-6 md:px-10 max-w-[1600px]'>
				{/* Title Animated on Scroll */}
				{/* <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl md:text-4xl lg:text-[40px] font-medium text-[#1e293b] mb-10 tracking-tight"
                >
                    Featured Projects
                </motion.h2> */}

				{/* Consistent Eyebrow Design */}
					<motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
						<div className="w-6 h-[2px] bg-[#FF5E14]" />
						<span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
							Featured Projects
						</span>
						<div className="w-6 h-[2px] bg-[#FF5E14]" />
				</motion.div>
				
					{/*  */}
				{/* <motion.h2
					variants={itemVariants}
					className='text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white mb-10'>
					Hand Pick
					<br />
					<span className='text-slate-400'>Projects</span>
				</motion.h2> */}

				<motion.h2
					variants={itemVariants}
					className='text-4xl lg:text-5xl font-bold tracking-tight text-[#00103A] mb-8'>
					Hand Pick
					<br />
					<span className='text-[#FF5E14]'>
						Projects
					</span>
				</motion.h2>

				{/* Staggered Cards Container */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-10%' }}
					ref={scrollContainerRef}
					className='flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8'
					style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
					{FEATURED_PROJECTS.map((project) => (
						<motion.div
							variants={cardEntranceVariants}
							key={project.id}
							className='snap-start shrink-0 w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-[340px]'>
							<Link
								href={`/projects/${project.slug}`}
								className='block h-full cursor-pointer'>
								{/* Hover orchestration wrapper */}
								<motion.div
									initial='rest'
									whileHover='hover'
									animate='rest'
									className='h-full w-full'>
									<Card className='h-[420px] md:h-[480px] w-full relative overflow-hidden rounded-xl border-0 shadow-none'>
										{/* Background Image Animated */}
										<motion.div
											variants={imageVariants}
											className='absolute inset-0 w-full h-full'>
											<Image
												src={project.cover_img}
												alt={project.name}
												fill
												className='object-cover'
												sizes='(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 25vw'
											/>
										</motion.div>

										{/* Dark Gradient Overlay */}
										<div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none' />

										{/* Content Container Animated */}
										<CardContent className='absolute inset-0 flex flex-col justify-end p-6 z-10 h-full pointer-events-none'>
											<motion.div variants={contentRevealVariants}>
                                                <p className='text-[#f5a623] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2'>
													{project.location}
												</p>
												<h3 className='text-xl sm:text-2xl font-bold text-white mb-1 leading-tight'>
													{project.name}
												</h3>

												{/* Description Animated */}
												<motion.div
													variants={textRevealVariants}
													className='overflow-hidden'>
													<p className='text-slate-300 text-sm leading-relaxed pr-12'>
														{project.description}
													</p>
												</motion.div>
											</motion.div>
										</CardContent>

										{/* Red CTA Arrow Button Animated */}
										<motion.div
											variants={buttonScaleVariants}
											className='absolute bottom-6 right-6 w-10 h-10 rounded-full bg-[#FF5E14] text-white flex items-center justify-center shadow-lg z-20 pointer-events-none'>
											<ArrowUpRight className='w-5 h-5' />
										</motion.div>
									</Card>
								</motion.div>
							</Link>
						</motion.div>
					))}
				</motion.div>

				{/* Navigation & Progress Bar UI */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className='mt-4 flex flex-col gap-6'>
					{/* Custom Spring Animated Progress Track */}
					<div className='relative w-full h-[10px] bg-[#fcd5d7] rounded-r-full overflow-hidden flex items-center'>
						<motion.div
							className='absolute left-0 top-0 h-full bg-[#FF5E14] rounded-r-full'
							animate={{ width: `${Math.max(scrollProgress, 5)}%` }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						/>
						<div className='absolute right-0 text-[#FF5E14] pr-1 hidden md:block z-10'>
							<Play className='w-3 h-3 fill-current' />
						</div>
					</div>

					{/* Pagination & Arrows */}
					<div className='flex items-center gap-4'>
						<button
							onClick={scrollLeft}
							className='w-8 h-8 rounded-full bg-[#fce7e8] hover:bg-[#fcd5d7] text-[#0F1836] flex items-center justify-center transition-colors disabled:opacity-50'
							disabled={scrollProgress === 0}
							aria-label='Previous projects'>
							<ArrowLeft className='w-4 h-4' />
						</button>

						<span className='text-[#0F1836] text-sm font-medium tabular-nums'>
							{firstVisible} – {lastVisible} of {totalItems}
						</span>

						<button
							onClick={scrollRight}
							className='w-8 h-8 rounded-full bg-[#fce7e8] hover:bg-[#fcd5d7] text-[#0F1836] flex items-center justify-center transition-colors disabled:opacity-50'
							disabled={scrollProgress >= 99}
							aria-label='Next projects'>
							<ArrowRight className='w-4 h-4' />
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
