"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProjectPartner } from "@/types";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addProjectPartner } from "@/app/(portal)/portal/actions/project-partners";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSaved: (partner: ProjectPartner) => void;
}

export default function CreatePartnerDialog({ isOpen, onClose, onSaved }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ form, setForm ] = useState({
        project_id: "", // In a real app, this might be a Select dropdown populated with active projects
        name: "", role: "",
        expertise: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        contract_value: "",
        website: "", logo_url: "",
        active: true
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const createForm = {
            ...form,
            contract_value: form.contract_value ? Number(form.contract_value) : 0,
        };
        
        const result = await addProjectPartner( createForm );
        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success("Partner created successfully");
        onSaved(result.data);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">Add New Partner</DialogTitle>
                    <DialogDescription className="text-slate-500">Register a new subcontractor or partner to the system.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Partner Name <span className="text-red-500">*</span></Label>
                            <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <Label>Project ID <span className="text-red-500">*</span></Label>
                            <Input required value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} className="dark:bg-slate-900" placeholder="UUID of associated project" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Role <span className="text-red-500">*</span></Label>
                            <Input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="dark:bg-slate-900" placeholder="e.g. Lead Architect" />
                        </div>
                        <div className="space-y-2">
                            <Label>Expertise <span className="text-red-500">*</span></Label>
                            <Input required value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} className="dark:bg-slate-900" placeholder="e.g. Structural Engineering" />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <h4 className="font-semibold text-sm">Contact Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Contact Name</Label>
                                <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="dark:bg-slate-900 bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="dark:bg-slate-900 bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input type="tel" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="dark:bg-slate-900 bg-white" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Contract Value (USD)</Label>
                            <Input type="number" value={form.contract_value} onChange={e => setForm({ ...form, contract_value: e.target.value })} className="dark:bg-slate-900 font-mono" placeholder="Internal use only" />
                        </div>
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="dark:bg-slate-900" placeholder="https://" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} className="data-[state=checked]:bg-emerald-500" />
                        <Label className="cursor-pointer">Mark as Active immediately</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Partner
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}