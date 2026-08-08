"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect_to') || '/portal/dashboard';

    // State
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    // Initialize Supabase Client    
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Sign in with Supabase auth
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                throw signInError;
            }

            // Step 2: Check if user is active (not suspended)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_active')
                .eq('email', email)
                .single()

            if (profileError) {
                throw new Error('Failed to verify user status')
            }

            if (!profile?.is_active) {
                // User is suspended — sign them out immediately
                await supabase.auth.signOut()
                throw new Error(
                    'Your account has been suspended. Please contact an administrator.'
                )
            }

            // Step 3: All checks passed — redirect
            router.push(redirectTo);            

        } catch (err) {
            const errorMessage = getErrorMessage(err, 'Invalid login credentials')   
            setError(errorMessage)
            toast.error(errorMessage)
            setIsLoading(false)
        }
    };


    return (
        <main className="flex min-h-screen w-full bg-white dark:bg-slate-950">

            {/* === LEFT COLUMN: Branding & Imagery (Hidden on Mobile) === */}
            <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden bg-[#00103A]">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
                        alt="Admin Portal Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00103A] via-transparent to-[#00103A]/80" />
                </div>

                {/* Diagonal Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none z-10"
                    style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
                />

                {/* Content */}
                <div className="relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute left-2 bottom-2 w-2.5 h-4 bg-[#00103A]" />
                            <div className="absolute right-2 top-2 w-2.5 h-4 bg-[#FF5E14] rounded-tl-full" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Conztru<span className="text-[#FF5E14]">.</span>
                        </span>
                    </div>
                </div>

                <div className="relative z-20">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                        Secure <br />
                        <span className="text-[#FF5E14]">Admin Portal</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-md">
                        Authorized personnel only. Access and manage projects, timelines, and website configurations here.
                    </p>
                </div>
            </div>

            {/* === RIGHT COLUMN: Login Form === */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#00103A] rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute left-2 bottom-2 w-2.5 h-4 bg-white" />
                            <div className="absolute right-2 top-2 w-2.5 h-4 bg-[#FF5E14] rounded-tl-full" />
                        </div>
                        <span className="text-2xl font-bold text-[#00103A] dark:text-white tracking-tight">
                            Conztru<span className="text-[#FF5E14]">.</span>
                        </span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-[#00103A] dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">

                        {/* Email Field */}
                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-sm font-semibold text-[#00103A] dark:text-white">Email Address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#FF5E14] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@conztru.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full bg-[#F5F7FA] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2 relative group">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-[#00103A] dark:text-white">Password</label>
                                <Link href="/auth/forgot-password" className="text-sm font-semibold text-[#0056e0] hover:text-[#FF5E14] transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#FF5E14] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full bg-[#F5F7FA] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:border-[#FF5E14] focus:ring-4 focus:ring-[#FF5E14]/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-100 dark:border-red-500/20"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium leading-relaxed">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            type="submit"
                            className="mt-4 w-full bg-[#FF5E14] hover:bg-[#e8530e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#FF5E14]/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>

                    </form>
                </motion.div>

            </div>
        </main>
    );
}