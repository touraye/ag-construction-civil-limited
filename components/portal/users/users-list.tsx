"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserRow from "./user-row";
import CreateUserDialog from "./create-user-dialog";
import EditUserSheet from "./edit-user-sheet";

interface Props {
    users: Profile[];
    onUsersChange: () => void;
}

export default function UsersList({ users, onUsersChange }: Props) {    
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ editingUser, setEditingUser ] = useState<Profile | null>(null);

    return (
        <div className="w-full space-y-4">
            {/* Header & Actions */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>

                {/* hide the button when the size of users[] is 0 meaning the logged-in user is not a super_admin */}
                {users.length > 0 && (
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New User
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-slate-800">
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider">Name</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider">Email</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider">Role</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider">Status</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider">Last Sign In</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onEdit={(u) => setEditingUser(u)}
                                    onUserChange={onUsersChange}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modals & Sheets */}
            <CreateUserDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onUserCreated={onUsersChange}
            />

            <EditUserSheet
                user={editingUser}
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                onUserUpdated={onUsersChange}
            />
        </div>
    );
}