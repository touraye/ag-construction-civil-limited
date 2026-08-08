"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProject, updateProject } from '@/app/(portal)/portal/actions/projects'
import type { _Project, ProjectType, ProjectStatus } from '@/types'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useProjectAuth } from '@/context/project-auth-context';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Props {
    mode: 'create' | 'edit'
    project?: _Project
}

const TYPES: ProjectType[] = [ 'residential', 'commercial', 'renovation', 'infrastructure', 'mixed-use', 'institutional' ]
const STATUSES: ProjectStatus[] = [ 'not-started', 'in-progress', 'completed' ]

export default function ProjectForm({ mode, project }: Props) {
    const router = useRouter()
    const { canEditProject } = useProjectAuth()
    const [ loading, setLoading ] = useState(false)

    const [ form, setForm ] = useState({        
        name: project?.name ?? '',
        type: project?.type ?? 'residential' as ProjectType,
        description: project?.description ?? '',
        location: project?.location ?? '',
        client: project?.client ?? '',
        area_sqm: project?.area_sqm ?? '',
        started_date: project?.started_date ?? '',
        status: project?.status ?? 'not-started' as ProjectStatus,
        featured: project?.featured ?? false,
        published: project?.published ?? false,
        cover_img: project?.cover_img ?? '',
        tags: project?.tags?.join(', ') ?? '',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            area_sqm: form.area_sqm ? Number(form.area_sqm) : undefined,
        }

        if (mode === 'edit' && !project) {
            toast.error('No project to update')
            setLoading(false)
            return
        }

        const result = mode === 'create'
            ? await createProject(payload)
            : await updateProject({ id: project!.id, ...payload })        

        setLoading(false)

        if (!result.success) {
            toast.error(result.error)
            return
        }

        toast.success(result.message ?? 'Project saved successfully')

        if (mode === 'create') {
            router.push(`/portal/projects/${result.data.id}`)
        } else {
            router.refresh()
        }
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <CardContent className="p-6 md:p-8">
                {/* Make all inputs read-only for view-only PMs */}
                {(!canEditProject) && (
                    <div className="text-sm text-muted-foreground mb-4">
                        You have view-only access to this project.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                            required value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            readOnly={!canEditProject}
                            className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Project Type</Label>
                            <Select
                                value={form.type}
                                onValueChange={v => setForm({ ...form, type: v as ProjectType })}
                                disabled={!canEditProject}>
                                
                                <SelectTrigger className="dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={v => setForm({ ...form, status: v as ProjectStatus })}
                                disabled={!canEditProject}
                            >
                                <SelectTrigger className="dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('-', ' ')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className={cn("dark:bg-slate-900 resize-none", `textarea ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                            disabled={!canEditProject}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                required
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                                disabled={!canEditProject}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Client Name</Label>
                            <Input
                                value={form.client}
                                onChange={e => setForm({ ...form, client: e.target.value })}
                                className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                                disabled={!canEditProject}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Area (sqm)</Label>
                            <Input
                                type="number"
                                value={form.area_sqm}
                                onChange={e => setForm({ ...form, area_sqm: e.target.value })}
                                className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                                disabled={!canEditProject}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Commencement Date</Label>
                            <Input
                                type="date"
                                value={form.started_date}
                                onChange={e => setForm({ ...form, started_date: e.target.value })}
                                className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                                disabled={!canEditProject}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Image URL</Label>
                        <Input
                            value={form.cover_img}
                            onChange={e => setForm({ ...form, cover_img: e.target.value })}
                            className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                            placeholder="https://..."
                            disabled={!canEditProject}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                            value={form.tags}
                            onChange={e => setForm({ ...form, tags: e.target.value })}
                            className={cn("dark:bg-slate-900", `input ${!canEditProject ? 'opacity-50 cursor-not-allowed' : ''}`)}
                            placeholder="e.g. high-rise, LEED, luxury"
                            disabled={!canEditProject}
                        />
                        <p className="text-xs text-slate-500">Comma-separated values.</p>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={form.featured}
                                onCheckedChange={c => setForm({ ...form, featured: c })}
                                disabled={!canEditProject}
                            />
                            <Label className="cursor-pointer">Featured on homepage</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch 
                                checked={form.published} 
                                onCheckedChange={c => setForm({ ...form, published: c })} 
                                className="data-[state=checked]:bg-emerald-500"
                                disabled={!canEditProject}
                            />
                            <Label className="cursor-pointer">Published (Live to public)</Label>
                        </div>
                    </div>

                   {(canEditProject) && (
                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : mode === 'create' ? 'Create Project' : 'Save Changes'}
                        </Button>
                    </div>
                   )}
                </form>
            </CardContent>
        </Card>
    )
}