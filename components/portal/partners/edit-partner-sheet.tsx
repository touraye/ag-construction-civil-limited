"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProjectPartner } from "@/types";


import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateProjectPartner } from "@/app/(portal)/portal/actions/project-partners";

interface Props {
    partner: ProjectPartner | null;
    isOpen: boolean;
    onClose: () => void;
    onSaved: (partner: ProjectPartner) => void;
}

export default function EditPartnerSheet({ partner, isOpen, onClose, onSaved }: Props) {
    const [ form, setForm ] = useState({     
        project_id: partner?.project_id || "", // In a real app, this might be a Select dropdown populated with active projects
        name: partner?.name || "",
        role: partner?.role || "",
        expertise: partner?.expertise || "",
        contact_name: partner?.contact_name || "",
        contact_email: partner?.contact_email || "",
        contact_phone: partner?.contact_phone || "",
        contract_value: partner?.contract_value ? partner.contract_value.toString() : "",
        website: partner?.website || "", logo_url: partner?.logo_url || "",
        active: partner?.active !== undefined ? partner.active : true
    });

    const [ loading, setLoading ] = useState(false);

    if (!partner) return null;

  
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!partner) return;

        const createForm = {
            ...form,            
            contract_value: form.contract_value ? Number(form.contract_value) : 0,
        };

        console.log("Submitting form:", partner.id, createForm);
        setLoading(true);

        const result = await updateProjectPartner(partner.id, createForm);

        setLoading(false);

        if (!result.success) {
            toast.error(result.error || "Failed to update partner");
            return;
        }

        toast.success(result.message ?? "Partner updated successfully");
        onSaved(result.data);
        onClose();
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-slate-900 dark:text-white">Edit Partner</SheetTitle>
                    <SheetDescription className="text-slate-500">Update records for {partner.name}.</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-8">

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Company Details</h4>
                        <div className="space-y-2">
                            <Label>Partner Name</Label>
                            <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label>Expertise</Label>
                                <Input required value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Project ID</Label>
                            <Input required value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact & Financials</h4>
                        <div className="space-y-2">
                            <Label>Point of Contact Name</Label>
                            <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="dark:bg-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input type="tel" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Contract Value (USD)</Label>
                            <Input type="number" value={form.contract_value} onChange={e => setForm({ ...form, contract_value: e.target.value })} className="dark:bg-slate-900 font-mono" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="space-y-0.5">
                            <Label className="text-base font-semibold">Active Status</Label>
                            <p className="text-xs text-slate-500">Currently active on this project.</p>
                        </div>
                        <Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} className="data-[state=checked]:bg-emerald-500" />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button type="submit" disabled={loading} className="w-full bg-[#0056e0] hover:bg-[#0048c2] text-white">
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}