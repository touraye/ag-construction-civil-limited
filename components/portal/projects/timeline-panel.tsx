"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, CheckCircle2, CircleDashed, Hammer, ArrowUp, ArrowDown } from "lucide-react";
import type { ProjectPhase, PhaseStatus } from "@/types";
import { getProjectProgress } from "@/types";
import {
    addProjectPhase,
    updatePhaseStatus,
    removeProjectPhase,
    reorderProjectPhases,
    updateProjectPhase // Assumed action for the edit sheet
} from "@/app/(portal)/portal/actions/project-phase";

// Shadcn Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import EditPhaseSheet from "./timeline-edit-sheet";
import { useProjectAuth } from "@/context/project-auth-context";


interface Props {
    projectId: string;
    phases: ProjectPhase[];
}

const STATUS_OPTIONS: PhaseStatus[] = [ "pending", "in-progress", "completed" ];

export default function TimelinePanel({ projectId, phases: initialPhases }: Props) {
    const { canEditProject } = useProjectAuth()
    const [ phases, setPhases ] = useState(initialPhases);

    // Progress Calculation
    const progress = getProjectProgress(phases);

    // --- Modal & Sheet States ---
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ editingPhase, setEditingPhase ] = useState<ProjectPhase | null>(null);
    const [ phaseToDelete, setPhaseToDelete ] = useState<ProjectPhase | null>(null);

    // --- Loading States ---
    const [ isAdding, setIsAdding ] = useState(false);    
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ updatingStatusId, setUpdatingStatusId ] = useState<string | null>(null);

    // --- Form States ---
    const [ createForm, setCreateForm ] = useState({ phase: "", price: "", description: "", start_date: "", end_date: "" });   

    
    // --- Handlers ---

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setIsAdding(true);

        // @ts-check
        const price = Number(createForm.price);

        const payload = {            
            ...createForm,
            price,
            status: "pending" as PhaseStatus,
            order_index: phases.length + 1,
            project_id: projectId
        };

        const result = await addProjectPhase(             
            payload
        );

        setIsAdding(false);

        if (!result.success) {
            toast.error(result.error || "Failed to add phase");
            return;
        }

        toast.success(result.message ?? "Phase added successfully");
        setPhases((prev) => [ ...prev, result.data ]);
        setCreateForm({ phase: "", price: "", description: "", start_date: "", end_date: "" });
        setIsCreateOpen(false);
    }   

    async function handleStatusChange(phaseId: string, status: PhaseStatus) {
        setUpdatingStatusId(phaseId);
        const result = await updatePhaseStatus(phaseId, projectId, status);
        setUpdatingStatusId(null);

        if (!result.success) {
            toast.error(result.error || "Failed to update status");
            return;
        }

        toast.success(result.message ?? "Phase status updated");
        setPhases((prev) => prev.map((p) => (p.id === phaseId ? { ...p, status } : p)));
    }

    async function handleDeleteConfirmed() {
        if (!phaseToDelete) return;
        setIsDeleting(true);

        const result = await removeProjectPhase(phaseToDelete.id, projectId);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.error || "Failed to remove phase");
            return;
        }

        toast.success(result.message ?? "Phase removed");
        setPhases((prev) => prev.filter((p) => p.id !== phaseToDelete.id));
        setPhaseToDelete(null);
    }

    async function movePhase(index: number, direction: "up" | "down") {
        if ((direction === "up" && index === 0) || (direction === "down" && index === phases.length - 1)) return;

        const newPhases = [ ...phases ];
        const swapIndex = direction === "up" ? index - 1 : index + 1;

        // Swap
        [ newPhases[ index ], newPhases[ swapIndex ] ] = [ newPhases[ swapIndex ], newPhases[ index ] ];

        // Optimistic Update
        setPhases(newPhases);

        const orderedIds = newPhases.map((p) => p.id);
        const result = await reorderProjectPhases(projectId, orderedIds);

        if (!result.success) {
            toast.error(result.error || "Failed to reorder");
            setPhases(phases); // Revert on failure
            return;
        }
    }

    return (
        <div className="w-full">
            {/* === Header & Progress === */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div className="w-full sm:w-2/3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Project Timeline</h3>

                    <div className="mb-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">
                            <span>Overall Progress</span>
                            <span className="text-[#0056e0]">{progress}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#0056e0] to-[#FF5E14]"
                            />
                        </div>
                    </div>
                </div>

                {canEditProject && (<Button onClick={() => setIsCreateOpen(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white shrink-0">
                    <Plus className="w-4 h-4 mr-2" /> Add Phase
                </Button>)}
            </div>

            {/* === Timeline List === */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {phases.map((phase, idx) => {
                        const isCompleted = phase.status === "completed";
                        const isInProgress = phase.status === "in-progress";

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                transition={{ duration: 0.2 }}
                                key={phase.id}
                                className="flex flex-col xl:flex-row xl:items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-4 group"
                            >
                                {/* Left Side: Info */}
                                <div className="flex items-start gap-4 flex-1">

                                    {/* Status Icon Indicator */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-500 dark:bg-emerald-500/10 dark:border-emerald-500/20" :
                                            isInProgress ? "bg-[#FF5E14]/10 border-[#FF5E14]/20 text-[#FF5E14]" :
                                                "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                            isInProgress ? <Hammer className="w-4 h-4 animate-bounce" /> :
                                                <CircleDashed className="w-5 h-5" />}
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-slate-400 font-bold text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                                            <h4 className={`text-base font-bold ${isInProgress ? 'text-[#FF5E14]' : 'text-slate-900 dark:text-white'}`}>
                                                {phase.phase}
                                            </h4>
                                        </div>

                                        <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md w-max mb-2">
                                            {phase.start_date} &rarr; {phase.end_date}
                                        </div>

                                        {phase.description && (
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                                                {phase.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Actions & Status */}
                                {canEditProject && (
                                    <div className="flex items-center gap-3 self-end xl:self-center ml-14 xl:ml-0">

                                    {/* Reorder Arrows */}
                                    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mr-2">
                                        <button onClick={() => movePhase(idx, "up")} disabled={idx === 0} className="p-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
                                            <ArrowUp className="w-3 h-3 text-slate-500" />
                                        </button>
                                        <button onClick={() => movePhase(idx, "down")} disabled={idx === phases.length - 1} className="p-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800 disabled:opacity-30 transition-colors">
                                            <ArrowDown className="w-3 h-3 text-slate-500" />
                                        </button>
                                    </div>

                                    {/* Status Dropdown with Spinner */}
                                    <div className="relative w-[130px]">
                                        <Select value={phase.status} onValueChange={(val) => handleStatusChange(phase.id, val as PhaseStatus)} disabled={updatingStatusId === phase.id}>
                                            <SelectTrigger className="h-9 dark:bg-slate-900 text-xs font-semibold uppercase tracking-wider">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((s) => (
                                                    <SelectItem key={s} value={s} className="uppercase text-xs font-bold tracking-wider">{s.replace("-", " ")}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {updatingStatusId === phase.id && (
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-3 h-3 animate-spin text-[#0056e0]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                        {canEditProject && ( 
                                            <>
                                            <Button variant="ghost" size="icon" onClick={() => setEditingPhase(phase)} className="text-slate-500 hover:text-[#0056e0]">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setPhaseToDelete(phase)} className="text-slate-500 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            </>
                                        )}
                                </div>)}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {phases.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        {canEditProject && (
                            <>
                                <CircleDashed className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm font-medium">No timeline phases added yet.</p>
                                <p className="text-slate-400 text-xs mt-1">Click &quot;Add Phase&quot; to build your project timeline.</p>
                            </>
                        )}
                    </motion.div>
                )}
            </div>

            {/* === 1. CREATE MODAL (Dialog) === */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-white">Add New Phase</DialogTitle>
                        <DialogDescription className="text-slate-500">Define a new stage in the project timeline.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Phase Name</Label>
                            <Input required placeholder="e.g. Design & Planning" value={createForm.phase} onChange={e => setCreateForm({ ...createForm, phase: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <Input type="number" required placeholder="e.g. 1000" value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea rows={3} placeholder="Describe the milestones for this phase..." value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} className="dark:bg-slate-900 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="date" required value={createForm.start_date} onChange={e => setCreateForm({ ...createForm, start_date: e.target.value })} className="dark:bg-slate-900 block" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" required value={createForm.end_date} onChange={e => setCreateForm({ ...createForm, end_date: e.target.value })} className="dark:bg-slate-900 block" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isAdding}>Cancel</Button>
                            <Button type="submit" disabled={isAdding} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                {isAdding ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Phase"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>  
            
            <EditPhaseSheet
                key={editingPhase?.id || 'empty'} // <--- Guarantees fresh state mount!
                projectId={projectId}
                phase={editingPhase}
                isOpen={!!editingPhase}
                onClose={() => setEditingPhase(null)}
                onSaved={(updatedPhase) => {
                    setPhases(prev => prev.map(p => p.id === updatedPhase.id ? updatedPhase : p));
                    setEditingPhase(null);
                }}
            />
                      

            {/* === 3. DELETE ALERT DIALOG === */}
            <AlertDialog open={!!phaseToDelete} onOpenChange={(open) => !open && setPhaseToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Phase?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove <strong>{phaseToDelete?.phase}</strong> from the timeline? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Delete Phase"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}