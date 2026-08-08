"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Service } from "@/types";
import { deleteService, toggleServicePublished } from "@/app/(portal)/portal/actions/services";
import { runAction } from "@/utils/handle-action-result";
import DynamicIcon from "@/components/shared/portal/dynamic-icon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Feature Components
import CreateServiceDialog from "./create-service-dialog";
import EditServiceSheet from "./edit-service-sheet";
import ServiceEditSheet from "./service-edit-sheet";

interface Props {
    initialServices: Service[];
}

export default function ServicesManager({ initialServices }: Props) {
    const [ services, setServices ] = useState(initialServices);

    // Modals & Sheets State
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ editingService, setEditingService ] = useState<Service | null>(null);

    // Delete Alert State
    const [ serviceToDelete, setServiceToDelete ] = useState<Service | null>(null);
    const [ isDeleting, setIsDeleting ] = useState(false);

    // Filters State
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ statusFilter, setStatusFilter ] = useState("all");
    const [ typeFilter, setTypeFilter ] = useState("all"); // Assuming 'icon' string dictates type conceptually

    // Extract unique icons/types for the filter
    const availableTypes = useMemo(() => {
        const types = new Set(services.map(s => s.icon || 'default'));
        return [ "all", ...Array.from(types) ];
    }, [ services ]);

    // Apply 3 Filters
    const filteredServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? s.published : !s.published);
            const matchesType = typeFilter === "all" || s.icon === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [ services, searchQuery, statusFilter, typeFilter ]);

    // Handlers
    function handleSaved(saved: Service) {
        setServices((prev) => {
            const exists = prev.find((s) => s.id === saved.id);
            if (exists) return prev.map((s) => (s.id === saved.id ? saved : s));
            return [ ...prev, saved ].sort((a, b) => a.order_index - b.order_index);
        });
        setIsCreateOpen(false);
        setEditingService(null);
    }

    async function handleDeleteConfirmed() {
        if (!serviceToDelete) return;
        setIsDeleting(true);

        const ok = await runAction(deleteService(serviceToDelete.id));
        if (ok) {
            setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
            toast.success("Service deleted");
        }

        setIsDeleting(false);
        setServiceToDelete(null);
    }

    async function handleTogglePublished(service: Service, newValue: boolean) {
        // Optimistic UI update
        setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, published: newValue } : s)));

        const ok = await runAction(toggleServicePublished(service.id, newValue));
        if (ok) {
            toast.success(`Service ${newValue ? "published" : "drafted"}`);
        } else {
            // Revert if failed
            setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, published: !newValue } : s)));
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="space-y-6">

            {/* === Top Bar & Filters === */}
            <div className="flex flex-col md:flex-row justify-between gap-4">

                {/* 3 Filters */}
                <div className="flex flex-1 flex-col sm:flex-row gap-3">
                    {/* 1. Name Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        />
                    </div>

                    {/* 2. Published Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40 dark:bg-slate-900">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* 3. Type/Category Filter (Using Icon as concept) */}
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-40 dark:bg-slate-900">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {availableTypes.filter(t => t !== "all").map(t => (
                                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white shrink-0">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
            </div>

            {/* === Data Table === */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-slate-800">
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Service Info</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Status</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredServices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                                    No services match your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredServices.map((service) => (
                                <TableRow key={service.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">

                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#0056e0]/10 flex items-center justify-center shrink-0">
                                                <DynamicIcon name={service.icon ?? 'help-circle'} size={20} className="text-[#0056e0]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 dark:text-white">{service.title}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{service.tagline || "No tagline provided"}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={service.published}
                                                onCheckedChange={(val) => handleTogglePublished(service, val)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                            <Badge variant="outline" className={`text-xs font-semibold ${service.published ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-slate-400 border-slate-400/30"}`}>
                                                {service.published ? "Published" : "Draft"}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingService(service)} className="text-slate-500 hover:text-[#0056e0]">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setServiceToDelete(service)} className="text-slate-500 hover:text-red-500">
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

            {/* === Alert Dialog for Deletion === */}
            <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Service</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{serviceToDelete?.title}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? "Deleting..." : "Delete Service"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* === Modals and Sheets === */}
            <CreateServiceDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSaved={handleSaved}
                nextOrderIndex={services.length + 1}
            />           

            <ServiceEditSheet
                key={editingService?.id || 'empty-edit-sheet'} // <-- CRITICAL for state reset
                service={editingService}
                isOpen={!!editingService}
                onClose={() => setEditingService(null)}
                onSaved={handleSaved}
            />

        </div>
    );
}