"use client";

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2 } from 'lucide-react';
import type { _Project, ProjectStatus, ProjectType } from '@/types';
import { deleteProject } from '@/app/(portal)/portal/actions/projects';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usePortalAuth } from '@/context/portal-auth-context';

type Props = {
    result: { success: true; data: _Project[] } | { success: false; error: string };
};

const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
        case "completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        case "in-progress": return "bg-[#FF5E14]/10 text-[#FF5E14] border-[#FF5E14]/20";
        case "not-started": return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300";
        default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
};

export default function ProjectsTable({ result }: Props) {
    const router = useRouter();
    const { isSuperAdmin, user } = usePortalAuth();    
    
    const [ statusFilter, setStatusFilter ] = useState<ProjectStatus | 'all'>('all');
    const [ typeFilter, setTypeFilter ] = useState<ProjectType | 'all'>('all');
    const [ search, setSearch ] = useState('');

    // Deletion State
    const [ projectToDelete, setProjectToDelete ] = useState<_Project | null>(null);
    const [ isDeleting, setIsDeleting ] = useState(false);

    useEffect(() => {
        if (!result.success) toast.error(result.error);
    }, [ result ]);

    const filtered = useMemo(() => {
        const projects = result.success ? result.data : [];
        return projects.filter(p => {
            if (statusFilter !== 'all' && p.status !== statusFilter) return false;
            if (typeFilter !== 'all' && p.type !== typeFilter) return false;
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [ result, statusFilter, typeFilter, search ]);

    // For a PM, derive which projects they're actually assigned to
    // and what their assignment looks like
    function getAssignment(project: _Project) {
        if (isSuperAdmin) return null  // admin doesn't need an assignment
        return project.project_assignments?.find(a => a.user_id === user.id) ?? null
    }

    function canManageProject(project: _Project): boolean {
        if (isSuperAdmin) return true
        const assignment = getAssignment(project)
        return assignment !== null  // PM can manage only if assigned
    }

    const handleDeleteConfirmed = async () => {
        if (!projectToDelete) return;
        setIsDeleting(true);
        const ok = await deleteProject(projectToDelete.id); 
        if (ok) {
            toast.success("Project deleted successfully");
            router.refresh(); // Refresh server component data
        }
        setIsDeleting(false);
        setProjectToDelete(null);
    };

    if (!result.success) {
        return (
            <div className="py-16 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                <p className="text-slate-900 dark:text-white font-semibold">Permission Denied</p>
                <p className="text-slate-500 text-sm mt-1">Contact an administrator to view projects.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search projects..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 dark:bg-slate-900"
                    />
                </div>

                <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                    <SelectTrigger className="w-full sm:w-40 dark:bg-slate-900">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(val: any) => setTypeFilter(val)}>
                    <SelectTrigger className="w-full sm:w-48 dark:bg-slate-900">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {[ 'residential', 'commercial', 'renovation', 'infrastructure', 'mixed-use', 'institutional' ].map(t => (
                            <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-slate-800">
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Project</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Type & Location</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Status</TableHead>
                            <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Published</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">No projects match your filters.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(project => (
                                <TableRow key={project.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                {project.name} {project.featured && <span title="Featured" className="text-yellow-500 text-xs">★</span>}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">{project.type}</span>
                                            <span className="text-xs text-slate-500">{project.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize ${getStatusConfig(project.status)}`}>
                                            {project.status.replace('-', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {project.published ? (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Draft</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {canManageProject(project) && (<Button variant="ghost" size="icon" asChild className="text-slate-500 hover:text-[#0056e0]">
                                                <Link href={`/portal/projects/${project.id}`}>
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Button>)}
                                            {isSuperAdmin &&( <Button variant="ghost" size="icon" onClick={() => setProjectToDelete(project)} className="text-slate-500 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Deletion Alert Dialog */}
            <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{projectToDelete?.name}</strong>? This action will permanently remove it from the database and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? "Deleting..." : "Delete Project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}