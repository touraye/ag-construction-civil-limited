"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Mail, Phone, Building2, Loader2 } from "lucide-react";
import type { _ProjectPartner } from "@/types";
import {
    addProjectPartner,
    removeProjectPartner,     
} from "@/app/(portal)/portal/actions/project-partners";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EditPartnerSheet from "./edit-partner-sheet";
import { useProjectAuth } from "@/context/project-auth-context";

interface Props {
    projectId: string;
    partners: _ProjectPartner[];
}

export default function PartnersPanel({ projectId, partners: initialPartners }: Props) {
    const { canEditProject } = useProjectAuth()
    // --- State ---
    const [ partners, setPartners ] = useState(initialPartners);

    // Modals & Sheets Visibility
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ editingPartner, setEditingPartner ] = useState<_ProjectPartner | null>(null);
    const [ partnerToDelete, setPartnerToDelete ] = useState<_ProjectPartner | null>(null);

    // Loading States for Spinners
    const [ isAdding, setIsAdding ] = useState(false);    
    const [ isDeleting, setIsDeleting ] = useState(false);

    // Form States
    const [ createForm, setCreateForm ] = useState({ name: "", expertise: "", role: "", contact_email: "", contact_phone: "" });
  

    // Sync edit form when a partner is selected for editing
 

    // --- Handlers ---

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setIsAdding(true);

        const result = await addProjectPartner({ project_id: projectId, ...createForm });        

        setIsAdding(false);

        if (!result.success) {
            toast.error(result.error || "Failed to add partner");
            return;
        }

        toast.success(result.message ?? "Partner successfully added");
        setPartners((prev) => [ ...prev, result.data ]);
        setCreateForm({ name: "", expertise: "", role: "", contact_email: "", contact_phone: "" });
        setIsCreateOpen(false);
    }
   

    async function handleDeleteConfirmed() {
        if (!partnerToDelete) return;

        setIsDeleting(true);

        const result = await removeProjectPartner(partnerToDelete.id, { project_id: projectId });

        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.error || "Failed to remove partner");
            return;
        }

        toast.success(result.message ?? "Partner removed successfully");
        setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id));
        setPartnerToDelete(null);
    }

    return (
        <div className="w-full">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Subcontractors & Partners</h3>
                    <p className="text-sm text-slate-500">Manage external organizations involved in this project.</p>
                </div>
               {(canEditProject) && (
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white shrink-0">
                        <Plus className="w-4 h-4 mr-2" /> Add Partner
                    </Button>
                )}
            </div>

            {/* Animated Partner List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {partners.map((p) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -10 }}
                            transition={{ duration: 0.2 }}
                            key={p.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800">
                                    <Building2 className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h4>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold text-[#0056e0] bg-[#0056e0]/10 px-2 py-0.5 rounded-md">
                                            {p.role}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            • {p.expertise}
                                        </span>
                                    </div>

                                    {/* Optional Contact Info display */}
                                    {(p.contact_email || p.contact_phone) && (
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                            {p.contact_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.contact_email}</span>}
                                            {p.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.contact_phone}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {(canEditProject) && (
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingPartner(p)} className="text-slate-500 hover:text-[#0056e0]">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setPartnerToDelete(p)} className="text-slate-500 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                </Button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {partners.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        {(canEditProject) ? (
                            <>
                                <p className="text-slate-500 text-sm font-medium">No partners added yet.</p>
                                <p className="text-slate-400 text-xs mt-1">Click &quot;Add Partner&quot; to associate subcontractors.</p>
                            </>
                        ) : <p>You do not have permission to this project.</p>}
                    </motion.div>
                )}
            </div>

            {/* === CREATE MODAL (Dialog) === */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-white">Add New Partner</DialogTitle>
                        <DialogDescription className="text-slate-500">Add an external subcontractor or agency to this project.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Company / Partner Name</Label>
                            <Input required placeholder="e.g. Apex Architecture Group" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input required placeholder="e.g. Lead Architect" value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label>Expertise</Label>
                                <Input required placeholder="e.g. Commercial Design" value={createForm.expertise} onChange={e => setCreateForm({ ...createForm, expertise: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Contact Email</Label>
                                <Input type="email" placeholder="contact@company.com" value={createForm.contact_email} onChange={e => setCreateForm({ ...createForm, contact_email: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Phone</Label>
                                <Input type="tel" placeholder="+1 (555) 000-0000" value={createForm.contact_phone} onChange={e => setCreateForm({ ...createForm, contact_phone: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isAdding}>Cancel</Button>
                            <Button type="submit" disabled={isAdding} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                {isAdding ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Partner"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* === EDIT SHEET === */}
            <EditPartnerSheet
                key={editingPartner?.id || 'empty'}
                partner={editingPartner}
                projectId={projectId}
                isOpen={!!editingPartner}
                onClose={() => setEditingPartner(null)}
                onSaved={(updatedPartner) => {
                    // Update the partner in your local list
                    setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
                    // Ensure the sheet closes
                    setEditingPartner(null);
                            }}
            />

            {/* === DELETE ALERT DIALOG === */}
            <AlertDialog open={!!partnerToDelete} onOpenChange={(open) => !open && setPartnerToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Remove Partner?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove <strong>{partnerToDelete?.name}</strong> from this project? This will not delete the partner from the database, only un-link them from this specific project.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing...</> : "Remove Partner"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}