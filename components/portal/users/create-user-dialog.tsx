"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createUser } from "@/app/(portal)/portal/actions/users";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export default function CreateUserDialog({ isOpen, onClose, onUserCreated }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
        full_name: "",
        role: "viewer" as const,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await createUser(formData);
            toast.success("User created successfully");
            setFormData({ email: "", password: "", full_name: "", role: "viewer" });
            onUserCreated();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">Create New User</DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Add a new user to the portal and assign their role.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="dark:bg-slate-900" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="dark:bg-slate-900" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="dark:bg-slate-900" />
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

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" className="bg-[#0056e0] hover:bg-[#0048c2] text-white" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create User
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}