"use client";

import { useState, useEffect, use, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, CircleDashed, Hammer, AlertCircle, Building2, Wallet, CreditCard, ArrowLeft } from "lucide-react";

import { getShareableProjectData, type ShareableProjectData } from "@/app/(portal)/portal/actions/project/public-share";
import { getCachedShareData, setCachedShareData } from "@/lib/utils/share-session-cache";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- 1. SKELETON LOADER ---
function ShareViewSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
            <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /></div>
                <Skeleton className="h-3 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[ 1, 2, 3 ].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
            </div>
            <div className="space-y-6">
                <Skeleton className="h-6 w-40" />
                {[ 1, 2, 3 ].map(i => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 2. CORE LOGIC COMPONENT ---
function ShareViewContent({ paramsPromise }: { paramsPromise: Promise<{ projectId: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const { projectId } = use(paramsPromise);

    const [ data, setData ] = useState<ShareableProjectData | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(true);

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!code) {
            router.push(`/share/${projectId}`);
            return;
        }

        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        async function loadData() {
            const cached = getCachedShareData(projectId, code!);
            if (cached) {
                setData(cached);
                setLoading(false);
                return;
            }

            const result = await getShareableProjectData(projectId, code!);
            setLoading(false);

            if (!result.success) {
                setError(result.error);
                hasFetchedRef.current = false;
                return;
            }

            setData(result.data);
            setCachedShareData(projectId, code!, result.data);
        }

        loadData();
    }, [ projectId, code, router ]);

    if (loading) {
        return <ShareViewSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-8 rounded-[2rem] max-w-md w-full text-center flex flex-col items-center shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                        {error ?? "This link is invalid, expired, or has reached its usage limit."}
                    </p>
                    <Button
                        onClick={() => router.push(`/share/${projectId}`)}
                        className="bg-[#0056e0] hover:bg-[#0048c2] text-white w-full rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Enter a different code
                    </Button>
                </div>
            </div>
        );
    }

    const { project, phases, financials } = data;
    const completedCount = phases.filter(p => p.status === "completed").length;
    const overallProgress = phases.length > 0 ? Math.round((completedCount / phases.length) * 100) : 0;
    const currency = (n: number) => new Intl.NumberFormat('en-GM', { style: 'currency', currency: 'GMD', maximumFractionDigits: 0 }).format(n);

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10"
        >
            {/* --- Project Header --- */}
            <motion.div variants={itemVariants} className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0056e0]/10 text-[#0056e0] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    <Building2 className="w-3.5 h-3.5" />
                    {project.type.replace("-", " ")}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                    {project.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                    {project.location}
                </p>
            </motion.div>

            {/* --- Overall Progress --- */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Overall Progress</h3>
                        <p className="text-sm text-slate-500">{completedCount} of {phases.length} milestones complete</p>
                    </div>
                    <span className="text-3xl font-black text-[#0056e0]">{overallProgress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#0056e0] to-emerald-400"
                    />
                </div>
            </motion.div>

            {/* --- Financial Summary (Conditional) --- */}
            {financials.included && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardContent className="p-6">
                            <Wallet className="w-5 h-5 text-slate-400 mb-4" />
                            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Contract Value</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{currency(financials.contractValue ?? 0)}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-500 text-white border-transparent shadow-md">
                        <CardContent className="p-6">
                            <CheckCircle2 className="w-5 h-5 text-emerald-200 mb-4" />
                            <div className="text-xs text-emerald-100 uppercase tracking-widest font-bold mb-1">Total Paid</div>
                            <div className="text-2xl font-black text-white">{currency(financials.totalPaid ?? 0)}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardContent className="p-6">
                            <CreditCard className="w-5 h-5 text-amber-500 mb-4" />
                            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Outstanding Balance</div>
                            <div className="text-2xl font-black text-amber-600 dark:text-amber-500">{currency(financials.outstanding ?? 0)}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* --- Project Timeline --- */}
            <motion.div variants={itemVariants} className="pt-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                    Project Timeline
                </h2>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-8">
                    {phases.map((phase, idx) => {
                        const isCompleted = phase.status === "completed";
                        const isInProgress = phase.status === "in-progress";

                        return (
                            <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-8 sm:pl-10"
                            >
                                {/* Timeline Node */}
                                <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F5F7FA] dark:border-slate-950 shadow-sm transition-colors ${isCompleted ? "bg-emerald-500 text-white" :
                                        isInProgress ? "bg-[#FF5E14] text-white" :
                                            "bg-slate-200 dark:bg-slate-800 text-slate-400"
                                    }`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                                        isInProgress ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                                                <Hammer className="w-3.5 h-3.5" />
                                            </motion.div>
                                        ) : <CircleDashed className="w-4 h-4" />}
                                </div>

                                {/* Timeline Content Card */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h4 className={`text-lg font-bold mb-1 ${isInProgress ? "text-[#FF5E14]" : "text-slate-900 dark:text-white"}`}>
                                                {idx + 1}. {phase.phase}
                                            </h4>
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                                {phase.start_date && new Date(phase.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                {' → '}
                                                {phase.end_date && new Date(phase.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isCompleted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                isInProgress ? "bg-[#FF5E14]/10 text-[#FF5E14] border-[#FF5E14]/20" :
                                                    "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                            }`}>
                                            {phase.status.replace("-", " ")}
                                        </span>
                                    </div>

                                    {phase.description && (
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                            {phase.description}
                                        </p>
                                    )}

                                    {/* Phase Financials (If included) */}
                                    {financials.included && phase.price !== undefined && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center gap-4 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">Milestone Value:</span>
                                                <span className="text-slate-900 dark:text-white font-bold">{currency(phase.price)}</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">Milestone Paid:</span>
                                                <span className="text-emerald-500 font-bold">{currency(phase.amountPaid ?? 0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* --- Footer --- */}
            <motion.div variants={itemVariants} className="text-center text-slate-400 text-xs pt-10 mt-10 border-t border-slate-200 dark:border-slate-800">
                <p><strong>Conztru Client Portal</strong> &middot; This is a secure, time-limited view of your project.</p>
            </motion.div>
        </motion.main>
    );
}

// --- 3. MAIN EXPORT WRAPPER ---
export default function ShareViewPage({ params }: { params: Promise<{ projectId: string }> }) {
    return (
        <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-950 transition-colors duration-300">
            {/* Universal Top Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#00103A] dark:bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute left-1.5 bottom-1.5 w-2 h-3 bg-white dark:bg-[#00103A]" />
                            <div className="absolute right-1.5 top-1.5 w-2 h-3 bg-[#FF5E14] rounded-tl-full" />
                        </div>
                        <div className="text-xl font-bold text-[#00103A] dark:text-white tracking-tight">Conztru<span className="text-[#FF5E14]">.</span></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full">
                        Live Report
                    </span>
                </div>
            </header>

            {/* Suspense handles the useSearchParams hook gracefully */}
            <Suspense fallback={<ShareViewSkeleton />}>
                <ShareViewContent paramsPromise={params} />
            </Suspense>
        </div>
    );
}