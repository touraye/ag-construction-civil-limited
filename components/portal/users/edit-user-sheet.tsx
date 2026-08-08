"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/app/(portal)/portal/actions/users";
import type { Profile } from "@/types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    user: Profile | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
}

export default function EditUserSheet({ user, isOpen, onClose, onUserUpdated }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ formData, setFormData ] = useState({ full_name: "", role: "viewer" });

    // Sync state when user prop changes
    useEffect(() => {
        if (user) setFormData({ full_name: user.full_name || "", role: user.role });
    }, [ user ]);

    if (!user) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await updateUser({ id: user!.id, full_name: formData.full_name, role: formData.role as any });
            toast.success("User profile updated");
            onUserUpdated();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6">
                <SheetHeader>
                    <SheetTitle className="text-slate-900 dark:text-white">Edit User</SheetTitle>
                    <SheetDescription className="text-slate-500 dark:text-slate-400">
                        Update user information and access permissions.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-8">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input disabled value={user.email} className="bg-slate-100 dark:bg-slate-900/50 cursor-not-allowed text-slate-500" />
                        <p className="text-xs text-slate-400">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input id="edit-name" type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="dark:bg-slate-900" />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={formData.role} onValueChange={(val: any) => setFormData({ ...formData, role: val })}>
                            <SelectTrigger className="dark:bg-slate-900">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="project_manager">Project Manager</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-3 mt-10">
                        <Button type="submit" className="w-full bg-[#0056e0] hover:bg-[#0048c2] text-white" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full">
                            Cancel
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}