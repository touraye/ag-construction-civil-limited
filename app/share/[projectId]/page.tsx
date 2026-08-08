"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

import { checkShareTokenValidity } from "@/app/(portal)/portal/actions/project/share-tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Core Logic Component ---
function ShareEntryForm({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [ projectId, setProjectId ] = useState("");
    const [ code, setCode ] = useState("");
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ autoChecking, setAutoChecking ] = useState(true);

    // EXACT LOGIC FROM YOUR ORIGINAL FILE
    useEffect(() => {
        params.then(({ projectId }) => {
            setProjectId(projectId);

            // If a code was passed in the URL (from a shared link), auto-submit
            const urlCode = searchParams.get('code');
            if (urlCode) {
                setCode(urlCode);
                validateAndRedirect(projectId, urlCode);
            } else {
                setAutoChecking(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function validateAndRedirect(pid: string, tokenCode: string) {
        setLoading(true);
        setError(null);

        const result = await checkShareTokenValidity(pid, tokenCode.trim().toUpperCase());

        setLoading(false);
        setAutoChecking(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        router.push(`/share/${pid}/view?code=${encodeURIComponent(tokenCode.trim().toUpperCase())}`);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!code.trim()) {
            setError('Please enter your access code');
            return;
        }
        await validateAndRedirect(projectId, code);
    }

    // --- Premium Fullscreen Loader ---
    if (autoChecking) {
        return (
            <div className="min-h-screen w-full bg-[#00103A] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#FF5E14] animate-spin mb-4" />
                <p className="text-slate-300 text-sm font-medium tracking-widest uppercase animate-pulse">
                    Verifying secure access...
                </p>
            </div>
        );
    }

    // --- Enhanced UI ---
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#00103A]">

            {/* Background Image & Overlays */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop"
                    alt="Architecture Background"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00103A] via-[#00103A]/80 to-transparent" />
            </div>

            {/* Diagonal Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none z-10"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 12px)" }}
            />

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-20 w-full max-w-md px-6"
            >
                <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800">

                    {/* Brand Logo & Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 bg-[#00103A] rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden shadow-md">
                            <div className="absolute left-3 bottom-3 w-3 h-5 bg-white" />
                            <div className="absolute right-3 top-3 w-3 h-5 bg-[#FF5E14] rounded-tl-full" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#00103A] dark:text-white mb-2">
                            Client Portal
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Enter your secure access code to view live project progress.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Access Code Input */}
                        <div className="space-y-2 relative group">
                            <Input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ENTER-YOUR-CODE"
                                maxLength={14}
                                disabled={loading}
                                className="w-full text-center font-mono text-lg tracking-widest py-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-[#0056e0] focus:ring-4 focus:ring-[#0056e0]/10 transition-all uppercase placeholder:text-slate-400"
                            />
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p className="font-medium leading-tight">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || !code.trim()}
                            className="w-full bg-[#0056e0] hover:bg-[#0048c2] text-white py-6 rounded-xl font-bold text-base transition-all group disabled:opacity-70"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
                            ) : (
                                <>
                                    View Project
                                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800 pt-6">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Secure, read-only client access.
                    </div>
                </div>

                <p className="text-center text-slate-400/80 text-xs mt-6">
                    Lost your code? Contact your Conztru project manager.
                </p>
            </motion.div>
        </div>
    );
}

// --- Main Export with Suspense Boundary ---
export default function ShareEntryPage({
    params,
}: {
    params: Promise<{ projectId: string }>
}) {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#00103A] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#FF5E14] animate-spin mb-4" />
                <p className="text-slate-300 text-sm font-medium tracking-widest uppercase animate-pulse">
                    Loading portal...
                </p>
            </div>
        }>
            <ShareEntryForm params={params} />
        </Suspense>
    );
}