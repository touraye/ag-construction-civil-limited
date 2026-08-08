"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import type { Profile } from "@/types";
import { suspendUser, reactivateUser, deleteUser } from "@/app/(portal)/portal/actions/users";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
    user: Profile;
    onEdit: (user: Profile) => void;
    onUserChange: () => void;
}

export default function UserRow({ user, onEdit, onUserChange }: Props) {
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);

    // Status Switch Handler
    const handleStatusToggle = async (checked: boolean) => {
        try {
            if (checked) {
                await reactivateUser(user.id);
                toast.success(`${user.email} reactivated`);
            } else {
                await suspendUser(user.id);
                toast.warning(`${user.email} suspended`);
            }
            onUserChange();
        } catch (err: any) {
            toast.error("Failed to update user status");
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUser(user.id);
            toast.success("User deleted permanently");
            onUserChange();
            setShowDeleteDialog(false);
        } catch (err: any) {
            toast.error("Error deleting user");
        } finally {
            setIsDeleting(false);
        }
    };

    const lastSignIn = user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleDateString()
        : "Never";

    return (
        <>
            <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <TableCell className="font-medium text-slate-900 dark:text-white">
                    {user.full_name || "—"}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                    {user.email}
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="capitalize text-xs font-semibold dark:border-slate-700">
                        {user.role.replace("_", " ")}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={user.is_active}
                            onCheckedChange={handleStatusToggle}
                            className={user.is_active ? "data-[state=checked]:bg-emerald-500" : ""}
                        />
                        <span className={`text-xs font-semibold uppercase ${user.is_active ? "text-emerald-500" : "text-slate-400"}`}>
                            {user.is_active ? "Active" : "Suspended"}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{lastSignIn}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(user)} className="text-slate-500 hover:text-[#0056e0] dark:hover:text-blue-400">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)} className="text-slate-500 hover:text-red-500 dark:hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Alert Dialog for Deletion */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            This will permanently delete <strong>{user.email}</strong> from the system and remove their data from the database. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? "Deleting..." : "Delete User"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}