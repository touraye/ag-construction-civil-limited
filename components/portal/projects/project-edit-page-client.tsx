'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { ProjectAuthProvider } from '@/context/project-auth-context'
import type { ActionResult } from '@/types/actions'
import type { _Project, _ProjectPartner, FinancePermission, ProjectPermission, ProjectPhase } from '@/types'
import ProjectEditTabs from './project-edit-tabs'

type ProjectBundle = {
    project: _Project
    partners: _ProjectPartner[]
    phases: ProjectPhase[]
}

interface Props {
    result: ActionResult<ProjectBundle>
    isSuperAdmin: boolean
    financePermission: FinancePermission | null
    projectPermission: ProjectPermission | null
}

export default function ProjectEditPageClient({ result, financePermission, projectPermission }: Props) {
    useEffect(() => {
        if (!result.success) toast.error(result.error)
    }, [ result ])

    if (!result.success) {
        return (
            <div className="p-8">
                <div className="py-16 text-center border border-white/10 rounded-sm">
                    <p className="text-red-500 text-sm">{result.error}</p>
                </div>
            </div>
        )
    }

    const { project, partners, phases } = result.data

    return (
        <ProjectAuthProvider  financePermission={financePermission} projectPermission={projectPermission}>
            <div className="p-8 max-w-4xl">
                <h1 className="font-display text-4xl text-brand-white mb-2">{project.name}</h1>
                <p className="text-brand-light text-sm mb-8">{project.location}</p>

                <ProjectEditTabs project={project} partners={partners} phases={phases}  />
            </div>
        </ProjectAuthProvider>
    )
}