"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactSection() {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);

    // Mock form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);

            // Reset after showing success message for 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <section className="relative w-full bg-[#F5F7FA] py-24 overflow-hidden z-0">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* === LEFT COLUMN: Contact Information === */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        className="flex flex-col"
                    >
                        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-[2px] bg-[#FF5E14]" />
                            <span className="text-[#00103A] font-bold tracking-widest text-sm uppercase">
                                Reach Out
                            </span>
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#00103A] mb-6 tracking-tight">
                            Let&apos;s start a <br className="hidden md:block" />
                            <span className="text-[#FF5E14]">conversation.</span>
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md">
                            Whether you have a question about our services, pricing, or want to discuss a monumental project, our team is ready to answer all your questions.
                        </motion.p>

                        {/* Info Cards List */}
                        <div className="flex flex-col gap-8 mb-12">
                            {/* Address */}
                            <motion.div variants={itemVariants} className="flex items-start gap-5 group">
                                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[#FF5E14]/30 group-hover:bg-[#FF5E14]/5 transition-colors duration-300">
                                    <MapPin className="w-6 h-6 text-[#00103A] group-hover:text-[#FF5E14] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-[#00103A] font-bold text-lg mb-1">Headquarters</h4>
                                    <p className="text-slate-500">2464 Royal Ln. Mesa,<br />New Jersey 45463</p>
                                </div>
                            </motion.div>

                            {/* Direct Contacts */}
                            <motion.div variants={itemVariants} className="flex items-start gap-5 group">
                                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[#FF5E14]/30 group-hover:bg-[#FF5E14]/5 transition-colors duration-300">
                                    <Phone className="w-6 h-6 text-[#00103A] group-hover:text-[#FF5E14] transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1 mt-1">
                                    <a href="tel:0000000000" className="text-slate-500 hover:text-[#FF5E14] font-medium transition-colors">(000) 000-0000</a>
                                    <a href="mailto:contact@conztru.com" className="text-slate-500 hover:text-[#FF5E14] font-medium transition-colors">contact@conztru.com</a>
                                </div>
                            </motion.div>

                            {/* Hours */}
                            <motion.div variants={itemVariants} className="flex items-start gap-5 group">
                                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[#FF5E14]/30 group-hover:bg-[#FF5E14]/5 transition-colors duration-300">
                                    <Clock className="w-6 h-6 text-[#00103A] group-hover:text-[#FF5E14] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-[#00103A] font-bold text-lg mb-1">Operating Hours</h4>
                                    <p className="text-slate-500">Mon - Fri: 8:00 AM - 6:00 PM<br />Sat - Sun: Closed</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Socials */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4 pt-8 border-t border-slate-200 max-w-md">
                            <span className="text-[#00103A] font-bold mr-2">Follow Us:</span>
                            {[ FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram ].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#00103A] flex items-center justify-center hover:bg-[#FF5E14] hover:text-white hover:border-[#FF5E14] transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* === RIGHT COLUMN: Interactive Form === */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        className="w-full relative"
                    >
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">

                            {/* Form Submission Success Overlay */}
                            <AnimatePresence>
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                                            className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6"
                                        >
                                            <CheckCircle2 className="w-10 h-10" />
                                        </motion.div>
                                        <h3 className="text-3xl font-bold text-[#00103A] mb-2">Message Sent!</h3>
                                        <p className="text-slate-500">Thank you for reaching out. One of our project managers will get back to you within 24 hours.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <h3 className="text-2xl font-bold text-[#00103A] mb-8">Send us a message</h3>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-[#00103A]">Full Name</label>
                                        <input
                                            type="text" id="name" required placeholder="John Doe"
                                            className="w-full bg-[#F5F7FA] border border-transparent rounded-xl px-5 py-4 text-slate-600 placeholder:text-slate-400 focus:bg-white focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none"
                                        />
                                    </div>
                                    {/* Email Field */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-[#00103A]">Email Address</label>
                                        <input
                                            type="email" id="email" required placeholder="john@company.com"
                                            className="w-full bg-[#F5F7FA] border border-transparent rounded-xl px-5 py-4 text-slate-600 placeholder:text-slate-400 focus:bg-white focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone Field */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-[#00103A]">Phone Number</label>
                                        <input
                                            type="tel" id="phone" placeholder="(555) 000-0000"
                                            className="w-full bg-[#F5F7FA] border border-transparent rounded-xl px-5 py-4 text-slate-600 placeholder:text-slate-400 focus:bg-white focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none"
                                        />
                                    </div>
                                    {/* Subject Field */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="subject" className="text-sm font-semibold text-[#00103A]">Inquiry Subject</label>
                                        <select
                                            id="subject" required
                                            className="w-full bg-[#F5F7FA] border border-transparent rounded-xl px-5 py-4 text-slate-600 focus:bg-white focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled selected>Select a topic...</option>
                                            <option value="new-project">New Project Consultation</option>
                                            <option value="career">Career / Employment</option>
                                            <option value="partnership">Partner / Vendor</option>
                                            <option value="other">Other Inquiry</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-[#00103A]">Your Message</label>
                                    <textarea
                                        id="message" required placeholder="Tell us about your project or inquiry..." rows={4}
                                        className="w-full bg-[#F5F7FA] border border-transparent rounded-xl px-5 py-4 text-slate-600 placeholder:text-slate-400 focus:bg-white focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-[#FF5E14] hover:bg-[#e8530e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            Send Message <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}