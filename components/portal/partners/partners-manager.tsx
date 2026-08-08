"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ProjectPartner } from "@/types";
import { deletePartner, togglePartnerActive } from "@/app/(portal)/portal/actions/project-partners";


// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import CreatePartnerDialog from "./create-partner-dialog";
import EditPartnerSheet from "./edit-partner-sheet";

interface Props {
    initialPartners: ProjectPartner[];
}

export default function PartnersManager({ initialPartners }: Props) {
    const [ partners, setPartners ] = useState(initialPartners);

    // Modals
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ editingPartner, setEditingPartner ] = useState<ProjectPartner | null>(null);
    const [ partnerToDelete, setPartnerToDelete ] = useState<ProjectPartner | null>(null);
    const [ isDeleting, setIsDeleting ] = useState(false);

    // Filters
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ statusFilter, setStatusFilter ] = useState("all");

    const filteredPartners = useMemo(() => {
        return partners.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.active : !p.active);
            return matchesSearch && matchesStatus;
        });
    }, [ partners, searchQuery, statusFilter ]);

    // Handlers
    function handleSaved(saved: ProjectPartner) {
        setPartners((prev) => {
            const exists = prev.find((p) => p.id === saved.id);
            if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
            return [ ...prev, saved ];
        });
    }

    async function handleDeleteConfirmed() {
        if (!partnerToDelete) return;
        setIsDeleting(true);

        const ok = await deletePartner(partnerToDelete.id);
        if (ok) {
            setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id));
            toast.success("Partner deleted");
        }

        setIsDeleting(false);
        setPartnerToDelete(null);
    }

    async function handleToggleActive(partner: ProjectPartner, newValue: boolean) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? { ...p, active: newValue } : p)));
        const ok = await togglePartnerActive(partner.id, newValue);
        if (ok) {
            toast.success(`Partner ${newValue ? "activated" : "deactivated"}`);
        } else {
            setPartners((prev) => prev.map((p) => (p.id === partner.id ? { ...p, active: !newValue } : p)));
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-6">

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Partners</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage project subcontractors and agencies.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Partner
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by name or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 dark:bg-slate-900">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Partner & Role</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Contact Info</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Status</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Contract Value</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPartners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">No partners match your filters.</TableCell>
                            </TableRow>
                        ) : (
                            filteredPartners.map((partner) => (
                                <TableRow key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                                {partner.logo_url ? (
                                                    <img src={partner.logo_url} alt={partner.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <Building2 className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {partner.name}
                                                    {partner.website && (
                                                        <a href={partner.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0056e0]">
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{partner.role} • {partner.expertise}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                                            {partner.contact_name ? <span className="font-medium">{partner.contact_name}</span> : <span className="text-slate-400 italic text-xs">No Contact Name</span>}
                                            {partner.contact_email && <span className="flex items-center gap-1.5 text-xs"><Mail className="w-3 h-3 text-slate-400" /> {partner.contact_email}</span>}
                                            {partner.contact_phone && <span className="flex items-center gap-1.5 text-xs"><Phone className="w-3 h-3 text-slate-400" /> {partner.contact_phone}</span>}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={partner.active}
                                                onCheckedChange={(val) => handleToggleActive(partner, val)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                            <Badge variant="outline" className={`text-xs ${partner.active ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-slate-400 border-slate-400/30"}`}>
                                                {partner.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {partner.contract_value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(partner.contract_value) : "—"}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingPartner(partner)} className="text-slate-500 hover:text-[#0056e0]">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setPartnerToDelete(partner)} className="text-slate-500 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreatePartnerDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSaved={handleSaved} />

            <EditPartnerSheet
                key={editingPartner?.id || 'empty-partner'}
                partner={editingPartner}
                isOpen={!!editingPartner}
                onClose={() => setEditingPartner(null)}
                onSaved={handleSaved}
            />

            <AlertDialog open={!!partnerToDelete} onOpenChange={(open) => !open && setPartnerToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Remove Partner</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{partnerToDelete?.name}</strong>? This will permanently remove their records from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? "Deleting..." : "Delete Partner"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}