"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ProjectPhase } from "@/types";
import { updateProjectPhase } from "@/app/(portal)/portal/actions/project-phase";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectAuth } from "@/context/project-auth-context";

interface Props {
    phase: ProjectPhase | null;
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSaved: (updated: ProjectPhase) => void;
}

export default function EditPhaseSheet({ phase, projectId, isOpen, onClose, onSaved }: Props) {
    const { canEditProject } = useProjectAuth()
    // The parent uses `key={phase?.id}` to guarantee a fresh mount when the phase changes.
    const [ editForm, setEditForm ] = useState({
        phase: phase?.phase || '',
        description: phase?.description || '',
        start_date: phase?.start_date || '',
        end_date: phase?.end_date || '',
    });

    const [ loading, setLoading ] = useState(false);

    // If there is no phase selected, we still render the Sheet shell 
    // so it can smoothly animate out when closed.
    if (!phase) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await updateProjectPhase(phase!.id, projectId, editForm);

        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message ?? 'Phase updated successfully');
        onSaved(result.data);
        onClose();
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 py-2 px-4 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-slate-900 dark:text-white">Edit Phase</SheetTitle>
                    <SheetDescription className="text-slate-500">
                        Update details for {phase.phase}.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-8">
                    <div className="space-y-2">
                        <Label>Phase Name</Label>
                        <Input
                            required
                            value={editForm.phase}
                            onChange={e => setEditForm({ ...editForm, phase: e.target.value })}
                            className="dark:bg-slate-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            rows={5}
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="dark:bg-slate-900 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                required
                                value={editForm.start_date}
                                onChange={e => setEditForm({ ...editForm, start_date: e.target.value })}
                                className="dark:bg-slate-900 block"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                required
                                value={editForm.end_date}
                                onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                                className="dark:bg-slate-900 block"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        {canEditProject && (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0056e0] hover:bg-[#0048c2] text-white">
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onClose}
                            disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}