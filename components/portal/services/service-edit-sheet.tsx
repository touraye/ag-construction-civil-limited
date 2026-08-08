"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Service } from "@/types";
import { updateService } from "@/app/(portal)/portal/actions/services";
import IconPicker from "./icon-picker";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
    onSaved: (service: Service) => void;
}

export default function ServiceEditSheet({ service, isOpen, onClose, onSaved }: Props) {
    // Initialize once from props. 
    // IMPORTANT: The parent MUST use `key={editingService?.id || 'empty'}` 
    // to guarantee a fresh mount and reset this state when the selected service changes.
    const [ editForm, setEditForm ] = useState({
        title: service?.title || "",
        tagline: service?.tagline || "",
        icon: service?.icon || "home",
        description: service?.description || "",
        long_desc: service?.long_desc || "",
        published: service?.published ?? false,
    });

    const [ loading, setLoading ] = useState(false);

    // If there is no service selected, we still render the Sheet shell 
    // so it can smoothly animate out when closed.
    if (!service) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await updateService({ id: service!.id, ...editForm });

        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message ?? 'Service updated successfully');
        onSaved(result.data);
        onClose();
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md md:max-w-2xl bg-white dark:bg-slate-950 py-4 px-6 border-slate-200 dark:border-slate-800 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-slate-900 dark:text-white">Edit Service</SheetTitle>
                    <SheetDescription className="text-slate-500">
                        Update details for {service.title}.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-8">
                    <div className="space-y-2">
                        <Label>Service Title</Label>
                        <Input
                            required
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input
                            value={editForm.tagline}
                            onChange={e => setEditForm({ ...editForm, tagline: e.target.value })}
                            className="dark:bg-slate-900"
                            placeholder="e.g. Built to last generations."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <IconPicker
                            value={editForm.icon}
                            onChange={icon => setEditForm({ ...editForm, icon })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea
                            rows={3}
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="dark:bg-slate-900 resize-none"
                            placeholder="Summary for service cards"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Full Page Description</Label>
                        <Textarea
                            rows={6}
                            value={editForm.long_desc}
                            onChange={e => setEditForm({ ...editForm, long_desc: e.target.value })}
                            className="dark:bg-slate-900 resize-y"
                            placeholder="Detailed explanation of the service"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="space-y-0.5">
                            <Label className="text-base font-semibold">Visibility</Label>
                            <p className="text-xs text-slate-500">Make this service public on the site.</p>
                        </div>
                        <Switch
                            checked={editForm.published}
                            onCheckedChange={c => setEditForm({ ...editForm, published: c })}
                            className="data-[state=checked]:bg-emerald-500"
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