'use client'

import { createContext, useContext } from 'react'
import type { FinancePermission, ProjectPermission } from '@/types'
import { usePortalAuth } from './portal-auth-context'

type ProjectAuthContextValue = {    
    financePermission: FinancePermission
    projectPermission: ProjectPermission | null  // null = super admin
    // Derived permission flags — computed once, used anywhere
    canReadFinance: boolean
    canWriteFinance: boolean
    canDeleteFinance: boolean
    canEditProject: boolean // can edit phases, partners, project details
}

const ProjectAuthContext = createContext<ProjectAuthContextValue | null>(null)

export function useProjectAuth() {
    const ctx = useContext(ProjectAuthContext)
    if (!ctx) throw new Error('useProjectAuth must be used within ProjectAuthProvider')
    return ctx
}

interface Props {    
    financePermission: FinancePermission
    projectPermission: ProjectPermission | null
    children: React.ReactNode
}

export function ProjectAuthProvider({ financePermission, projectPermission, children }: Props) {
    // Pull isSuperAdmin from the global context — no need to re-pass it
    const { isSuperAdmin } = usePortalAuth()

    const value: ProjectAuthContextValue = {       
        financePermission,
        projectPermission,
        canReadFinance: isSuperAdmin || (financePermission !== null && financePermission !== undefined),
        canWriteFinance: isSuperAdmin || financePermission === 'read_write' || financePermission === 'read_write_delete',
        canDeleteFinance: isSuperAdmin || financePermission === 'read_write_delete',
        // null projectPermission = super admin = full edit access
        canEditProject: isSuperAdmin || projectPermission === 'edit',
    }

    return (
        <ProjectAuthContext.Provider value={value}>
            {children}
        </ProjectAuthContext.Provider>
    )
}