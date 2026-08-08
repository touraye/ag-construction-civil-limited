"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { UserPlus, Shield, Trash2, Key, Loader2, HardHat } from "lucide-react";

import type { ProjectAssignment, FinancePermission, ProjectPermission } from "@/types";
import {
    getProjectAssignments,
    getProjectManagers,
    assignProjectManager,
    updateProjectAssignment,
    removeProjectAssignment,
} from "@/app/(portal)/portal/actions/project/project-assignments";

// Shadcn UI Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Props {
    projectId: string;
}

const FINANCE_OPTIONS: { value: FinancePermission | "none"; label: string; description: string }[] = [
    { value: "none", label: "No access", description: "Cannot view any payment data" },
    { value: "read", label: "View only", description: "Can view payments but not edit" },
    { value: "read_write", label: "View & edit", description: "Can view and add/edit payments" },
    { value: "read_write_delete", label: "Full access", description: "Can view, edit and delete payments" },
];

const PROJECT_OPTIONS: { value: ProjectPermission; label: string; description: string }[] = [
    { value: "view", label: "View only", description: "Can view project information but not edit" },
    { value: "edit", label: "View & edit", description: "Can view and edit project information" },
];

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SettingsPanel({ projectId }: Props) {
    const [ assignments, setAssignments ] = useState<ProjectAssignment[]>([]);
    const [ managers, setManagers ] = useState<{ id: string; full_name: string | null; email: string }[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ assigning, setAssigning ] = useState(false);
    const [ showAssignForm, setShowAssignForm ] = useState(false);

    const [ assignForm, setAssignForm ] = useState({
        user_id: "",
        is_lead: false,
        finance_permission: "none" as FinancePermission | "none",
        project_permission: "view" as ProjectPermission,
    });

    const loadData = useCallback(async () => {
        setLoading(true);

        const [ assignmentsResult, managersResult ] = await Promise.all([
            getProjectAssignments(projectId),
            getProjectManagers(),
        ]);

        setLoading(false);

        if (!assignmentsResult.success) {
            toast.error(assignmentsResult.error);
            return;
        }

        if (!managersResult.success) {
            toast.error(managersResult.error);
            return;
        }

        setAssignments(assignmentsResult.data);

        // Filter out already-assigned managers from the dropdown
        const assignedIds = assignmentsResult.data.map((a) => a.user_id);
        setManagers(managersResult.data.filter((m) => !assignedIds.includes(m.id)));
    }, [ projectId ]);

    useEffect(() => { loadData(); }, [ loadData ]);

    // --- Handlers ---
    async function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        if (!assignForm.user_id) {
            toast.error("Please select a project manager");
            return;
        }

        setAssigning(true);
        const result = await assignProjectManager({
            project_id: projectId,
            ...assignForm,
            finance_permission: assignForm.finance_permission === "none" ? null : assignForm.finance_permission
        });
        setAssigning(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message ?? "PM assigned successfully");
        setAssignments((prev) => [ ...prev, result.data ]);
        setManagers((prev) => prev.filter((m) => m.id !== assignForm.user_id));
        setAssignForm({ user_id: "", is_lead: false, finance_permission: "none", project_permission: "view" });
        setShowAssignForm(false);
    }

    async function handleToggleLead(assignment: ProjectAssignment, is_lead: boolean) {
        // Optimistic UI
        setAssignments((prev) => prev.map((a) => ({ ...a, is_lead: a.id === assignment.id ? is_lead : is_lead ? false : a.is_lead })));

        const result = await updateProjectAssignment({ id: assignment.id, project_id: projectId, is_lead });

        if (!result.success) {
            toast.error(result.error);
            loadData(); // Revert
            return;
        }
        toast.success(result.message ?? "Lead status updated");
    }

    async function handleFinancePermissionChange(assignment: ProjectAssignment, val: FinancePermission | "none") {
        const finance_permission = val === "none" ? null : val;
        setAssignments((prev) => prev.map((a) => (a.id === assignment.id ? { ...a, finance_permission } : a)));

        const result = await updateProjectAssignment({ id: assignment.id, project_id: projectId, finance_permission });
        if (!result.success) { toast.error(result.error); loadData(); return; }
        toast.success(result.message ?? "Finance access updated");
    }

    async function handleProjectPermissionChange(assignment: ProjectAssignment, project_permission: ProjectPermission) {
        setAssignments((prev) => prev.map((a) => (a.id === assignment.id ? { ...a, project_permission } : a)));

        const result = await updateProjectAssignment({ id: assignment.id, project_id: projectId, project_permission });
        if (!result.success) { toast.error(result.error); loadData(); return; }
        toast.success(result.message ?? "Project access updated");
    }

    async function handleRemove(assignment: ProjectAssignment) {
        const name = assignment.profiles?.full_name ?? "this project manager";
        if (!confirm(`Remove ${name} from this project?`)) return;

        const result = await removeProjectAssignment(assignment.id, projectId);

        if (!result.success) { toast.error(result.error); return; }

        toast.success(result.message ?? "Removed successfully");

        // Return the removed PM to the available dropdown list
        if (assignment.profiles) {
            setManagers((prev) => [ ...prev, { id: assignment.user_id, full_name: assignment.profiles!.full_name, email: assignment.profiles!.email } ]);
        }
        setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
    }

    // --- Loading Skeleton ---
    if (loading) {
        return (
            <div className="w-full space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                {[ 1, 2 ].map(i => (
                    <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full space-y-8">

            {/* === HEADER SECTION === */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        Assigned Project Managers
                    </h3>
                    <p className="text-slate-500 text-sm">
                        {assignments.length} manager{assignments.length !== 1 ? 's' : ''} assigned · Only one can be designated as Lead PM.
                    </p>
                </motion.div>
                {managers.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <Button
                            onClick={() => setShowAssignForm(!showAssignForm)}
                            variant={showAssignForm ? "outline" : "default"}
                            className={!showAssignForm ? "bg-[#0056e0] hover:bg-[#0048c2] text-white" : ""}
                        >
                            {showAssignForm ? "Cancel Assignment" : <><UserPlus className="w-4 h-4 mr-2" /> Assign PM</>}
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* === ASSIGN NEW MANAGER FORM === */}
            <AnimatePresence>
                {showAssignForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                            <CardContent className="pt-6">
                                <form onSubmit={handleAssign} className="space-y-6">

                                    {/* Row 1: Manager Selection */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-900 dark:text-white">Project Manager <span className="text-red-500">*</span></Label>
                                        <Select value={assignForm.user_id} onValueChange={v => setAssignForm({ ...assignForm, user_id: v })}>
                                            <SelectTrigger className="bg-white dark:bg-slate-950">
                                                <SelectValue placeholder="Select a manager from your team..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {managers.map(m => (
                                                    <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Row 2: Permissions Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-900 dark:text-white flex items-center gap-2">
                                                <HardHat className="w-4 h-4 text-[#0056e0]" /> Project Access
                                            </Label>
                                            <Select value={assignForm.project_permission} onValueChange={v => setAssignForm({ ...assignForm, project_permission: v as ProjectPermission })}>
                                                <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {PROJECT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label} — <span className="text-slate-400">{opt.description}</span></SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-900 dark:text-white flex items-center gap-2">
                                                <Key className="w-4 h-4 text-emerald-500" /> Finance Access
                                            </Label>
                                            <Select value={assignForm.finance_permission || ""} onValueChange={v => setAssignForm({ ...assignForm, finance_permission: v as FinancePermission | "none" })}>
                                                <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FINANCE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value || ""}>{opt.label} — <span className="text-slate-400">{opt.description}</span></SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Row 3: Toggle & Submit */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Switch checked={assignForm.is_lead} onCheckedChange={c => setAssignForm({ ...assignForm, is_lead: c })} className="data-[state=checked]:bg-[#0056e0]" />
                                            <div>
                                                <Label className="cursor-pointer">Designate as Lead PM</Label>
                                                <p className="text-xs text-slate-500">Automatically replaces any existing lead.</p>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={assigning || !assignForm.user_id} className="w-full sm:w-auto bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                            {assigning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Assigning...</> : "Assign to Project"}
                                        </Button>
                                    </div>

                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === ASSIGNMENTS LIST === */}
            <motion.div variants={itemVariants} className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {assignments.map(assignment => {
                        const profile = assignment.profiles;
                        const financeOpt = FINANCE_OPTIONS.find(o => o.value === assignment.finance_permission) ?? FINANCE_OPTIONS[ 0 ];
                        const projectOpt = PROJECT_OPTIONS.find(o => o.value === assignment.project_permission) ?? PROJECT_OPTIONS[ 0 ];

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                key={assignment.id}
                            >
                                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">

                                    {/* Card Header (Profile & Status) */}
                                    <CardHeader className="flex flex-row items-start justify-between pb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700">
                                                <AvatarFallback className="bg-[#0056e0]/10 text-[#0056e0] font-bold text-lg">
                                                    {(profile?.full_name ?? profile?.email ?? "?")[ 0 ].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{profile?.full_name ?? profile?.email}</h4>
                                                    {assignment.is_lead && (
                                                        <Badge className="bg-[#0056e0] hover:bg-[#0056e0] text-white text-[10px] uppercase tracking-widest px-2 py-0">Lead PM</Badge>
                                                    )}
                                                </div>
                                                <span className="text-sm text-slate-500">{profile?.email}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemove(assignment)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </CardHeader>

                                    {/* Card Body (Permissions Selectors) */}
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">

                                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                                            <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <HardHat className="w-3.5 h-3.5" /> Project Access
                                            </Label>
                                            <Select value={assignment.project_permission ?? "view"} onValueChange={v => handleProjectPermissionChange(assignment, v as ProjectPermission)}>
                                                <SelectTrigger className="h-8 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {PROJECT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[10px] text-slate-400 mt-1.5 ml-1">{projectOpt.description}</p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                                            <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Key className="w-3.5 h-3.5" /> Finance Access
                                            </Label>
                                            <Select value={assignment.finance_permission ?? "none"} onValueChange={v => handleFinancePermissionChange(assignment, v as FinancePermission | "none")}>
                                                <SelectTrigger className="h-8 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FINANCE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value || ""} className="text-xs">{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[10px] text-slate-400 mt-1.5 ml-1">{financeOpt.description}</p>
                                        </div>

                                    </CardContent>

                                    {/* Card Footer (Lead Toggle) */}
                                    <CardFooter className="pt-0 pb-4">
                                        <div className="flex items-center gap-3">
                                            <Switch checked={assignment.is_lead} onCheckedChange={c => handleToggleLead(assignment, c)} className="data-[state=checked]:bg-[#0056e0]" />
                                            <Label className="text-xs text-slate-500 font-semibold cursor-pointer">Designate as Lead PM</Label>
                                        </div>
                                    </CardFooter>

                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {assignments.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950">
                        <Shield className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium text-lg">No project managers assigned.</p>
                        <p className="text-slate-400 text-sm mt-1">Assign a PM to allow them to manage phases, partners, and progress.</p>
                    </motion.div>
                )}
            </motion.div>

        </motion.div>
    );
}