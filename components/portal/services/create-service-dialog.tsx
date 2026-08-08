"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Service } from "@/types";
import { createService } from "@/app/(portal)/portal/actions/services";
import IconPicker from "./icon-picker"; // Assuming you have this existing component

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSaved: (service: Service) => void;
    nextOrderIndex: number;
}

export default function CreateServiceDialog({ isOpen, onClose, onSaved, nextOrderIndex }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ form, setForm ] = useState({ title: "", tagline: "", icon: "home", description: "", long_desc: "", published: true });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await createService({ ...form, order_index: nextOrderIndex });
        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success("Service created successfully");
        setForm({ title: "", tagline: "", icon: "home", description: "", long_desc: "", published: true });
        onSaved(result.data);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">New Service</DialogTitle>
                    <DialogDescription className="text-slate-500">Add a new service offering to your portfolio.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="dark:bg-slate-900" placeholder="e.g. Residential" />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <IconPicker value={form.icon} onChange={icon => setForm({ ...form, icon })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="dark:bg-slate-900" placeholder="e.g. Built to last generations." />
                    </div>

                    <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="dark:bg-slate-900 resize-none" placeholder="Summary for service cards" />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Switch checked={form.published} onCheckedChange={c => setForm({ ...form, published: c })} className="data-[state=checked]:bg-emerald-500" />
                        <Label className="cursor-pointer">Publish immediately</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" className="bg-[#0056e0] hover:bg-[#0048c2] text-white" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Service
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}