"use client";

import { useState, useEffect, useCallback } from "react";
import { useProjectAuth } from '@/context/project-auth-context'
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Banknote, Calendar, CheckCircle2, CircleDashed, Edit,
    Trash2, Plus, Loader2, DollarSign, TrendingUp, AlertCircle
} from "lucide-react";

import type { ProjectPhase, PhasePayment, FinancePermission } from "@/types";
import {
    getProjectPaymentSummary,
    addPhasePayment,
    markPaymentAsPaid,
    deletePhasePayment,
    updatePhasePrice,
    updatePhasePayment,
    // updatePhasePayment // <--- You will need to add this action to your backend for the Edit Sheet to work
} from "@/app/(portal)/portal/actions/payments";
import { getProjectContractValue, getProjectTotalPaid, getPhaseAmountPaid } from "@/utils/compute-payments";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton"; // <--- Added Skeleton Import

interface Props {
    projectId: string;                  
}

const formatGMD = (amount: number) =>
    new Intl.NumberFormat("en-GM", { style: "currency", currency: "GMD", maximumFractionDigits: 0 }).format(amount);

export default function PaymentsPanel({ projectId }: Props) {
    const { canReadFinance, canWriteFinance, canDeleteFinance } = useProjectAuth()
    const [ phases, setPhases ] = useState<ProjectPhase[]>([]);
    const [ loading, setLoading ] = useState(true);

    // Super admin always gets full access
    // PM gets access only if their specific permission level allows it
    const canRead = canReadFinance
    const canWrite = canWriteFinance
    const canDelete = canDeleteFinance
    

    // --- Modals & Sheets State ---    
    const [ activePhaseForAdd, setActivePhaseForAdd ] = useState<ProjectPhase | null>(null);
    const [ paymentToEdit, setPaymentToEdit ] = useState<{ payment: PhasePayment, phaseId: string } | null>(null);
    const [ paymentToDelete, setPaymentToDelete ] = useState<{ paymentId: string, phaseId: string } | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // --- Forms State ---
    const [ addForm, setAddForm ] = useState({ amount: "", paid_on: "", status: "pending" as const, note: "" });
    const [ editForm, setEditForm ] = useState({ amount: "", paid_on: "", status: "pending" as const, note: "" });

    const loadData = useCallback(async () => {
        setLoading(true);
        const result = await getProjectPaymentSummary(projectId);
        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }
        setPhases(result.data);
    }, [ projectId ]);

    useEffect(() => { loadData(); }, [ loadData ]);

    // Sync Edit Form
    useEffect(() => {
        if (paymentToEdit) {
            setEditForm({
                amount: paymentToEdit.payment.amount.toString(),
                paid_on: paymentToEdit.payment.paid_on,
                status: paymentToEdit.payment.status as any,
                note: paymentToEdit.payment.note || "",
            });
        }
    }, [ paymentToEdit ]);

    // --- Summary Figures ---
    const contractValue = getProjectContractValue(phases);
    const totalPaid = getProjectTotalPaid(phases);
    const totalPending = contractValue - totalPaid;
    const paidPercent = contractValue > 0 ? Math.min(100, Math.round((totalPaid / contractValue) * 100)) : 0;

    // --- Handlers ---
    async function handlePriceChange(phaseId: string, price: number) {
        const phase = phases.find(p => p.id === phaseId);
        if (phase?.price === price) return;

        const result = await updatePhasePrice(phaseId, price, projectId);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success(result.message ?? "Price updated successfully");
        setPhases(prev => prev.map(p => (p.id === phaseId ? { ...p, price } : p)));
    }

    async function handleAddPayment(e: React.FormEvent) {
        e.preventDefault();
        if (!activePhaseForAdd) return;

        setIsSubmitting(true);
        const result = await addPhasePayment({
            phase_id: activePhaseForAdd.id,
            amount: Number(addForm.amount),
            paid_on: addForm.paid_on,
            status: addForm.status,
            note: addForm.note || undefined,
        }, projectId);
        setIsSubmitting(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message ?? "Payment added successfully");
        setPhases(prev => prev.map(p =>
            p.id === activePhaseForAdd.id
                ? { ...p, payments: [ ...(p.payments ?? []), result.data ] }
                : p
        ));
        setAddForm({ amount: "", paid_on: "", status: "pending", note: "" });
        setActivePhaseForAdd(null);
    }

    async function handleEditPayment(e: React.FormEvent) {
        e.preventDefault();
        if (!paymentToEdit) return;
        setIsSubmitting(true);

        const result = await updatePhasePayment(
            paymentToEdit.payment.id,   // ✅ the payment's own ID
            {
                amount: Number(editForm.amount),
                paid_on: editForm.paid_on,
                status: editForm.status,
                note: editForm.note
            },
            projectId,
        )

        if (!result.success) {
            toast.error(result.error)
            return
        }

        // Mocking success for the UI template:
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Payment updated successfully");
            loadData();
            setPaymentToEdit(null);
        }, 1000);
    }

    async function handleMarkPaid(paymentId: string, phaseId: string) {
        const result = await markPaymentAsPaid(paymentId, projectId);
        if (!result.success) { toast.error(result.error); return; }

        toast.success("Marked as paid");
        setPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, payments: p.payments?.map(pay => pay.id === paymentId ? result.data : pay) }
                : p
        ));
    }

    async function handleDeletePayment() {
        if (!paymentToDelete) return;

        setIsSubmitting(true);
        const result = await deletePhasePayment(paymentToDelete.paymentId, projectId);
        setIsSubmitting(false);

        if (!result.success) { toast.error(result.error); return; }

        toast.success(result.message ?? "Payment deleted");
        setPhases(prev => prev.map(p =>
            p.id === paymentToDelete.phaseId
                ? { ...p, payments: p.payments?.filter(pay => pay.id !== paymentToDelete.paymentId) }
                : p
        ));
        setPaymentToDelete(null);
    }

    // === PREMIUM SKELETON LOADING STATE ===
    if (loading) {
        return (
            <div className="w-full space-y-8 animate-in fade-in duration-500">
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[ 1, 2, 3 ].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-[130px] flex flex-col justify-center gap-3">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-8 w-40 rounded-md" />
                        </div>
                    ))}
                </div>

                {/* Overall Progress Skeleton */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                        <Skeleton className="h-4 w-48 rounded-md" />
                        <Skeleton className="h-6 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                </div>

                {/* Phases Breakdown Skeleton */}
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64 rounded-md mb-6" />

                    {[ 1, 2 ].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 md:p-8 shadow-sm">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-48 rounded-md" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full mb-8" />

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-16 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // === MAIN RENDER (Data Loaded) ===
    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">

            {/* === 1. FINANCIAL SUMMARY CARDS === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-100 dark:text-slate-800/5 pointer-events-none" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 relative z-10">Contract Value</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white relative z-10">{formatGMD(contractValue)}</h3>
                </div>

                <div className="bg-[#0056e0] text-white rounded-2xl p-6 shadow-md flex flex-col justify-center relative overflow-hidden">
                    <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 pointer-events-none" />
                    <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-1 relative z-10">Total Paid</p>
                    <h3 className="text-3xl font-black text-white relative z-10">{formatGMD(totalPaid)}</h3>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-red-50 dark:text-red-500/5 pointer-events-none" />
                    <p className="text-sm font-bold text-red-500 uppercase tracking-widest mb-1 relative z-10">Outstanding</p>
                    <h3 className="text-3xl font-black text-red-600 dark:text-red-400 relative z-10">{formatGMD(totalPending)}</h3>
                </div>
            </div>

            {/* === 2. OVERALL PROGRESS BAR === */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Overall Payment Progress</h4>
                    <span className="text-[#0056e0] font-black text-xl">{paidPercent}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: `${paidPercent}%` }} transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#0056e0] to-emerald-400"
                    />
                </div>
            </div>

            {/* === 3. PHASE BREAKDOWN LIST === */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Milestone Payments</h3>

                {phases.map(phase => {
                    const phasePaid = getPhaseAmountPaid(phase.payments ?? []);
                    const phaseRemaining = (phase.price ?? 0) - phasePaid;
                    const phasePercent = phase.price > 0 ? Math.min(100, Math.round((phasePaid / phase.price) * 100)) : 0;
                    const isFullyPaid = phase.price > 0 && phasePaid >= phase.price;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            key={phase.id}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 md:p-8 shadow-sm"
                        >
                            {/* Phase Header */}
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6">
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{phase.phase}</h4>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold">
                                            {formatGMD(phasePaid)} Paid
                                        </span>
                                        <span className="text-slate-400">/</span>
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-semibold">
                                            {formatGMD(phase.price ?? 0)} Total
                                        </span>
                                        {phaseRemaining > 0 && (
                                            <span className="text-red-500 font-medium ml-2">{formatGMD(phaseRemaining)} Remaining</span>
                                        )}
                                    </div>
                                </div>

                                {/* Editable Price Input */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0">Milestone Value (GMD)</Label>
                                    <Input
                                        type="number"
                                        defaultValue={phase.price ?? 0}
                                        onBlur={canWrite ? e => handlePriceChange(phase.id, Number(e.target.value)) : undefined}
                                        className="w-full sm:w-40 h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${phasePercent}%` }} className="h-full bg-emerald-500" />
                            </div>

                            {/* Payment Records Table */}
                            {(phase.payments ?? []).length > 0 && (
                                <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Status</th>
                                                <th className="px-4 py-3 font-semibold">Amount</th>
                                                <th className="px-4 py-3 font-semibold">Date</th>
                                                <th className="px-4 py-3 font-semibold">Notes</th>
                                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {phase.payments!.map(payment => (
                                                <tr key={payment.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <Badge variant="outline" className={payment.status === 'paid' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                                                            {payment.status === 'paid' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <CircleDashed className="w-3 h-3 mr-1" />}
                                                            {payment.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{formatGMD(payment.amount)}</td>
                                                    <td className="px-4 py-3 text-slate-500 flex items-center gap-1.5 mt-0.5"><Calendar className="w-3.5 h-3.5" /> {payment.paid_on}</td>
                                                    <td className="px-4 py-3 text-slate-500 italic max-w-[200px] truncate">{payment.note || "—"}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {payment.status === 'pending' && canWrite && (
                                                                <Button variant="outline" size="sm" onClick={() => handleMarkPaid(payment.id, phase.id)} className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:border-slate-700">
                                                                    Mark Paid
                                                                </Button>
                                                            )}
                                                            {canWrite && (
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0056e0]" onClick={() => setPaymentToEdit({ payment, phaseId: phase.id })}>
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            {canDelete && (
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => setPaymentToDelete({ paymentId: payment.id, phaseId: phase.id })}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Add Payment Button */}
                            {isFullyPaid ? (
                                // Always show the fully paid badge regardless of permission —
                                // even read-only users should know the milestone is settled
                                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-bold text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> Milestone Fully Paid
                                </div>
                            ) : canWrite ? (
                                // Not fully paid AND user can write → show the add button
                                <Button
                                    onClick={() => setActivePhaseForAdd(phase)}
                                    className="bg-[#0056e0] hover:bg-[#0048c2] text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Payment Record
                                </Button>
                            ) : null}
                            {/* read-only PM + not fully paid → null, no button, no badge */}

                            {/* {canWrite && !isFullyPaid && (
                                <Button onClick={() => setActivePhaseForAdd(phase)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                    <Plus className="w-4 h-4 mr-2" /> Add Payment Record
                                </Button>
                            ) ? (
                                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-bold text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> Milestone Fully Paid
                                </div>
                            ) : null} */}
                        </motion.div>
                    );
                })}

                {phases.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950">
                        <Banknote className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No timeline phases found.</p>
                        <p className="text-slate-400 text-sm mt-1">Add phases in the Timeline tab first to log payments.</p>
                    </div>
                )}
            </div>

            {/* === MODALS & SHEETS === */}

            {/* 1. Add Payment Dialog */}
            <Dialog open={!!activePhaseForAdd} onOpenChange={(open) => !open && setActivePhaseForAdd(null)}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-white">Log Payment</DialogTitle>
                        <DialogDescription>Record a transaction for <strong>{activePhaseForAdd?.phase}</strong>.</DialogDescription>
                    </DialogHeader>
                    {activePhaseForAdd && (() => {
                        const paid = getPhaseAmountPaid(activePhaseForAdd.payments ?? []);
                        const remaining = activePhaseForAdd.price - paid;

                        return (
                            <form onSubmit={handleAddPayment} className="space-y-4 pt-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[#0056e0] dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/50 text-sm font-medium flex justify-between">
                                    <span>Remaining Balance:</span>
                                    <span>{formatGMD(remaining)}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label>Amount (GMD)</Label>
                                    <Input
                                        type="number" required min={1} max={remaining}
                                        value={addForm.amount}
                                        onChange={e => setAddForm({ ...addForm, amount: e.target.value })}
                                        className="dark:bg-slate-900"
                                    />
                                    <p className="text-xs text-slate-400">Cannot exceed remaining balance.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" required value={addForm.paid_on} onChange={e => setAddForm({ ...addForm, paid_on: e.target.value })} className="dark:bg-slate-900 block" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={addForm.status} onValueChange={(val: any) => setAddForm({ ...addForm, status: val })}>
                                            <SelectTrigger className="dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes (Optional)</Label>
                                    <Textarea rows={2} value={addForm.note} onChange={e => setAddForm({ ...addForm, note: e.target.value })} className="dark:bg-slate-900 resize-none" placeholder="e.g. Wire transfer reference #..." />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setActivePhaseForAdd(null)} disabled={isSubmitting}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Payment"}
                                    </Button>
                                </div>
                            </form>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* 2. Edit Payment Sheet */}
            <Sheet open={!!paymentToEdit} onOpenChange={(open) => !open && setPaymentToEdit(null)}>
                <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 py-2 px-4">
                    <SheetHeader>
                        <SheetTitle className="text-slate-900 dark:text-white">Edit Payment Record</SheetTitle>
                        <SheetDescription className="text-slate-500">Update transaction details.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleEditPayment} className="space-y-6 pt-8">
                        <div className="space-y-2">
                            <Label>Amount (GMD)</Label>
                            <Input type="number" required value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" required value={editForm.paid_on} onChange={e => setEditForm({ ...editForm, paid_on: e.target.value })} className="dark:bg-slate-900 block" />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={editForm.status} onValueChange={(val: any) => setEditForm({ ...editForm, status: val })}>
                                    <SelectTrigger className="dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea rows={3} value={editForm.note} onChange={e => setEditForm({ ...editForm, note: e.target.value })} className="dark:bg-slate-900 resize-none" />
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setPaymentToEdit(null)} disabled={isSubmitting}>Cancel</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* 3. Delete Alert Dialog */}
            <AlertDialog open={!!paymentToDelete} onOpenChange={(open) => !open && setPaymentToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Payment Record?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">This will permanently remove the payment from the financial ledger. This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePayment} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Delete Payment"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}