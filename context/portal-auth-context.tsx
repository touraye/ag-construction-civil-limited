'use client'

import { createContext, useContext } from 'react'
import type { FinancePermission } from '@/types'

export type UserRole = 'super_admin' | 'project_manager' | 'editor' | 'viewer'

export type PortalUser = {
    id: string
    email: string
    full_name: string | null
    role: UserRole
    avatar_url: string | null
}

type PortalAuthContextValue = {
    // ── Identity ──────────────────────────────────────
    user: PortalUser

    // ── Role flags ────────────────────────────────────
    isSuperAdmin: boolean
    isProjectManager: boolean
    isEditor: boolean
    isViewer: boolean

    // ── Content permissions ───────────────────────────
    // Who can manage services, testimonials, partners, blog
    canManageContent: boolean   // super_admin + editor

    // ── Project permissions ───────────────────────────
    // Who can see the projects section at all
    canViewProjects: boolean   // super_admin + project_manager

    // Who can create / delete projects
    canMutateProjects: boolean  // super_admin only

    // ── Finance permissions (project-scoped) ──────────
    // These are null for super_admin (always full access)
    // and set per-project for project_managers
    // Use ProjectAuthContext for project-specific finance checks
    hasAnyFinanceAccess: boolean  // true if super_admin OR has any finance permission on any project

    // ── User management ───────────────────────────────
    canManageUsers: boolean  // super_admin only

    // ── Dashboard ─────────────────────────────────────
    canViewFinancialSummary: boolean  // super_admin only
    canViewProjectSummary: boolean  // super_admin + project_manager
}

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null)

export function usePortalAuth() {
    const ctx = useContext(PortalAuthContext)
    if (!ctx) throw new Error('usePortalAuth must be used within PortalAuthProvider')
    return ctx
}

interface Props {
    user: PortalUser
    children: React.ReactNode
}

export function PortalAuthProvider({ user, children }: Props) {
    const role = user.role

    const isSuperAdmin = role === 'super_admin'
    const isProjectManager = role === 'project_manager'
    const isEditor = role === 'editor'
    const isViewer = role === 'viewer'

    const value: PortalAuthContextValue = {
        // Identity
        user,

        // Role flags
        isSuperAdmin,
        isProjectManager,
        isEditor,
        isViewer,

        // Content — editors and admins manage site content
        canManageContent: isSuperAdmin || isEditor,

        // Projects — PMs and admins can view, only admin can mutate
        canViewProjects: isSuperAdmin || isProjectManager,
        canMutateProjects: isSuperAdmin,

        // Finance — super admin always has it, PMs checked per-project in ProjectAuthContext
        hasAnyFinanceAccess: isSuperAdmin,

        // User management — admin only
        canManageUsers: isSuperAdmin,

        // Dashboard widgets
        canViewFinancialSummary: isSuperAdmin,
        canViewProjectSummary: isSuperAdmin || isProjectManager,
    }

    return (
        <PortalAuthContext.Provider value={value}>
            {children}
        </PortalAuthContext.Provider>
    )
}