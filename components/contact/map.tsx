"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

export default function Map() {
    // The exact Google Plus Code provided
    const plusCode = "77HC+668 Jambanjelly, WCR";

    // URL encoded for the iframe and directions link
    const encodedLocation = encodeURIComponent(plusCode);

    return (
        <section className="relative w-full bg-white pb-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 md:px-8">

                {/* === Header === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                        <span className="text-[#00103A] font-medium tracking-wide text-sm uppercase">
                            Our Location
                        </span>
                        <div className="w-6 h-[2px] bg-[#FF5E14]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#00103A]">
                        Visit Our National Headquarters
                    </h2>
                </motion.div>

                {/* === Map Container === */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-100"
                >
                    {/* 
            Google Maps Iframe 
            Using the standard non-API key embed format mapped directly to your Plus Code
          */}
                    <iframe
                        title="Office Location Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }} // Slight filter to make the map colors pop
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodedLocation}&t=m&z=15&output=embed&iwloc=near`}
                        className="absolute inset-0"
                    />

                    {/* === Floating Info Card (Bottom Left) === */}
                    <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#00103A] flex items-center justify-center shrink-0 shadow-md">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#00103A] mb-1">AG Constructions HQ</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        {plusCode}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#FF5E14] hover:bg-[#e8530e] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md group"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Get Directions
                                </a>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-[#00103A] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors group"
                                >
                                    View on Google Maps
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#00103A] transition-colors" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                </motion.div>

            </div>
        </section>
    );
}