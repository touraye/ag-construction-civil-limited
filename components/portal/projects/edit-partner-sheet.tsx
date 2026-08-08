"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { _ProjectPartner } from "@/types";
import { updateProjectPartner } from "@/app/(portal)/portal/actions/project-partners";

// Shadcn UI Imports
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    partner: _ProjectPartner | null;
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSaved: (updated: _ProjectPartner) => void;
}

export default function EditPartnerSheet({ partner, projectId, isOpen, onClose, onSaved }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ editForm, setEditForm ] = useState({
        name: partner?.name || "",
        expertise: partner?.expertise || "",
        role: partner?.role || "",
        contact_email: partner?.contact_email || "",
        contact_phone: partner?.contact_phone || "",
        project_id: projectId || ""
    });



    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!partner) return;

        setLoading(true);

        const result = await updateProjectPartner(
            partner.id,            
            editForm
        );        

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
            <SheetContent className="w-full sm:max-w-md py-6 px-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-slate-900 dark:text-white">Edit Partner</SheetTitle>
                    <SheetDescription className="text-slate-500">
                        Update details for {partner?.name}.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-8">
                    <div className="space-y-2">
                        <Label>Company / Partner Name</Label>
                        <Input
                            required
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                            required
                            value={editForm.role}
                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Expertise</Label>
                        <Input
                            required
                            value={editForm.expertise}
                            onChange={e => setEditForm({ ...editForm, expertise: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input
                            type="email"
                            value={editForm.contact_email}
                            onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Phone</Label>
                        <Input
                            type="tel"
                            value={editForm.contact_phone}
                            onChange={e => setEditForm({ ...editForm, contact_phone: e.target.value })}
                            className="dark:bg-slate-900"
                        />
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