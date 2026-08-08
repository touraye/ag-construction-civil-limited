import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { ContentPermission, FinancePermission, ProjectPermission } from '@/types'

export type RoleCheckResult =
    | {
        ok: true;
        supabase: SupabaseClient;
        userId: string,
        role: string,
        isSuperAdmin: boolean,
        // Scoped permission — meaning depends on which check function set it:
        // 'projectPermission' for checkUser(), 'contentPermission' for checkEditorOrAdmin()
        projectPermission?: ProjectPermission | null
        contentPermission?: ContentPermission | null
    }
    | { ok: false; error: string }


type FinanceAccessResult =
    | { ok: true; supabase: SupabaseClient; userId: string; isSuperAdmin: boolean; permission: FinancePermission }
    | { ok: false; error: string }

export async function checkSuperAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { ok: false as const, error: 'Unauthorized' }

    const role = user.user_metadata?.role
    if (role !== 'super_admin') {
        return { ok: false as const, error: 'Only super admins can manage payments' }
    }

    return { ok: true as const, supabase, userId: user.id }
}    


// This function checks if the user is a super admin or a project manager, and if a projectId is provided, it checks the user's assignment for that project
export async function checkUser(
    projectId?: string
): Promise<RoleCheckResult> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { ok: false, error: 'Unauthorized' }
    }

    const role = user.user_metadata?.role

    if (role !== 'super_admin' && role !== 'project_manager') {
        return { ok: false, error: 'You do not have permission to manage projects' }
    }

    const isSuperAdmin = role === 'super_admin'

    // Super admin — full access, no assignment lookup needed
    if (isSuperAdmin) {
        return {
            ok: true,
            supabase,
            userId: user.id,
            role,
            isSuperAdmin: true,
            projectPermission: null,   // null = unrestricted, treated as full access everywhere
        }
    }

    // project_manager — needs a projectId to look up their specific permission
    if (!projectId) {
        // No specific project context (e.g. getAllProjects) — default to 'view'
        // so any accidental write attempt without a projectId fails safe
        return {
            ok: true,
            supabase,
            userId: user.id,
            role,
            isSuperAdmin: false,
            projectPermission: 'view',
        }
    }

    const { data: assignment, error } = await supabase
        .from('project_assignments')
        .select('project_permission')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single()

    if (error || !assignment) {
        return { ok: false, error: 'You are not assigned to this project' }
    }

    return {
        ok: true,
        supabase,
        userId: user.id,
        role,
        isSuperAdmin: false,
        projectPermission: assignment.project_permission as ProjectPermission,
    }
}

export async function checkEditorOrAdmin(): Promise<RoleCheckResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { ok: false, error: 'Unauthorized' }
    }

    const role = user.user_metadata?.role

    if (role !== 'super_admin' && role !== 'editor') {
        return { ok: false, error: 'Only admins and editors can manage services' }
    }

    const isSuperAdmin = role === 'super_admin'

    // Super admin — unrestricted
    if (isSuperAdmin) {
        return {
            ok: true,
            supabase,
            userId: user.id,
            role,
            isSuperAdmin: true,
            contentPermission: null,   // null = full access
        }
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('content_permission')
        .eq('id', user.id)
        .single()

    if (error || !profile) {
        return { ok: false, error: 'Profile not found' }
    }   
    

    return {
        ok: true,
        supabase,
        userId: user.id,
        role,
        isSuperAdmin: false,
        contentPermission: (profile.content_permission as ContentPermission) ?? 'view',

    }
}


export async function checkProjectMgtOrAdmin(projectId?: string): Promise<RoleCheckResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { ok: false, error: 'Unauthorized' }
    }

    const role = user.user_metadata?.role

    if (role === 'super_admin') {
        return {
            ok: true,
            supabase,
            userId: user.id,
            role,
            isSuperAdmin: true,
            projectPermission: null,  // null = full access, no restriction
        }
    }
    
    if (role === 'project_manager') {
        if (!projectId) {
            // No projectId provided — only allow read-level operations
            // (e.g. getAllProjects which doesn't need write access)           
            return {
                ok: true,
                supabase,
                userId: user.id,
                role,
                isSuperAdmin: false,
                projectPermission: 'view',
            }
        }

        const { data: assignment, error } = await supabase
            .from('project_assignments')
            .select('project_permission, finance_permission')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single()

        if (error || !assignment) {
            return { ok: false, error: 'You are not assigned to this project' }
        }

    return {
      ok: true,
      supabase,
      userId: user.id,
      role,
      isSuperAdmin: false,
      projectPermission: assignment.project_permission as ProjectPermission,
    }
  }

  return { ok: false, error: 'You do not have permission to access projects' }
}


export async function checkFinanceAccess(
    projectId: string,
    requiredLevel: 'read' | 'read_write' | 'read_write_delete'
): Promise<FinanceAccessResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { ok: false, error: 'Unauthorized' }

    const role = user.user_metadata?.role

    // Super admin always has full access — no assignment check needed
    if (role === 'super_admin') {
        return {
            ok: true,
            supabase,
            userId: user.id,
            isSuperAdmin: true,
            permission: 'read_write_delete',
        }
    }

    // For project managers, check their specific finance_permission on this project
    if (role === 'project_manager') {
        const { data: assignment, error } = await supabase
            .from('project_assignments')
            .select('finance_permission')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single()

        if (error || !assignment) {
            return { ok: false, error: 'You are not assigned to this project' }
        }

        const permission = assignment.finance_permission as FinancePermission

        if (!permission) {
            return { ok: false, error: 'You do not have finance access on this project' }
        }

        // Check the permission level is sufficient for what's being attempted
        const LEVELS: Record<NonNullable<FinancePermission>, number> = {
            read: 1,
            read_write: 2,
            read_write_delete: 3,
        }

        const required = LEVELS[ requiredLevel ]
        const granted = LEVELS[ permission ]

        if (granted < required) {
            const readableRequired = requiredLevel.replace(/_/g, ' ')
            return {
                ok: false,
                error: `Your finance access (${permission.replace(/_/g, ' ')}) is insufficient for this action. Required: ${readableRequired}`,
            }
        }

        return {
            ok: true,
            supabase,
            userId: user.id,
            isSuperAdmin: false,
            permission,
        }
    }

    // Any other role (editor, viewer) has no finance access at all
    return { ok: false, error: 'You do not have permission to access financial data' }
}
