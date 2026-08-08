'use server'

import { revalidatePath } from 'next/cache'
import { checkSuperAdmin } from '@/lib/auth/role-check'
import type { ActionResult } from '@/types/actions'
import type { ProjectAssignment, FinancePermission, ProjectPermission } from '@/types'

// ─── GET ALL ASSIGNMENTS FOR A PROJECT ───────────────
export async function getProjectAssignments(
    projectId: string
): Promise<ActionResult<ProjectAssignment[]>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('project_assignments')
        .select('*, profiles(id, full_name, email, role, avatar_url)')
        .eq('project_id', projectId)
        .order('assigned_at', { ascending: true })

    if (error) return { success: false, error: error.message }

    return { success: true, data: data as ProjectAssignment[] }
}

// ─── GET ALL PROJECT MANAGERS (for the assign dropdown) ─
export async function getProjectManagers(): Promise<ActionResult<{
    id: string
    full_name: string | null
    email: string
}[]>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'project_manager')
        .eq('is_active', true)
        .order('full_name', { ascending: true })

    if (error) return { success: false, error: error.message }

    return { success: true, data: data ?? [] }
}

// ─── ASSIGN PM TO PROJECT ─────────────────────────────
export type AssignPMInput = {
    project_id: string
    user_id: string
    is_lead?: boolean
    project_permission?: ProjectPermission
    finance_permission?: FinancePermission
}

export async function assignProjectManager(
    input: AssignPMInput
): Promise<ActionResult<ProjectAssignment>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    // Check the user being assigned is actually a project_manager
    const { data: profile, error: profileError } = await check.supabase
        .from('profiles')
        .select('role, full_name, is_active')
        .eq('id', input.user_id)
        .single()

    if (profileError || !profile) {
        return { success: false, error: 'User not found' }
    }

    if (profile.role !== 'project_manager') {
        return { success: false, error: 'Only users with the project manager role can be assigned to projects' }
    }

    if (!profile.is_active) {
        return { success: false, error: 'Cannot assign a suspended user to a project' }
    }

    // Check not already assigned
    const { data: existing } = await check.supabase
        .from('project_assignments')
        .select('id')
        .eq('project_id', input.project_id)
        .eq('user_id', input.user_id)
        .single()

    if (existing) {
        return { success: false, error: `${profile.full_name ?? 'This user'} is already assigned to this project` }
    }

    // If assigning as lead, demote any existing lead first
    if (input.is_lead) {
        await check.supabase
            .from('project_assignments')
            .update({ is_lead: false })
            .eq('project_id', input.project_id)
            .eq('is_lead', true)
    }

    const { data, error } = await check.supabase
        .from('project_assignments')
        .insert({
            project_id: input.project_id,
            user_id: input.user_id,
            is_lead: input.is_lead ?? false,
            finance_permission: input.finance_permission ?? null,
        })
        .select('*, profiles(id, full_name, email, role, avatar_url)')
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${input.project_id}`)

    return {
        success: true,
        data: data as ProjectAssignment,
        message: `${profile.full_name ?? 'Project manager'} assigned successfully`,
    }
}

// ─── UPDATE ASSIGNMENT (lead status + finance permission) ─
export type UpdateAssignmentInput = {
    id: string
    project_id: string
    is_lead?: boolean
    finance_permission?: FinancePermission
    project_permission?: ProjectPermission  
}

export async function updateProjectAssignment(
    input: UpdateAssignmentInput
): Promise<ActionResult<ProjectAssignment>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    // If promoting to lead, demote any existing lead first
    if (input.is_lead) {
        await check.supabase
            .from('project_assignments')
            .update({ is_lead: false })
            .eq('project_id', input.project_id)
            .eq('is_lead', true)
            .neq('id', input.id)  // don't demote the one we're about to promote
    }

    const updateData: Record<string, unknown> = {}
    if (input.is_lead !== undefined) updateData.is_lead = input.is_lead
    if (input.finance_permission !== undefined) updateData.finance_permission = input.finance_permission
    if (input.project_permission !== undefined) updateData.project_permission = input.project_permission

    const { data, error } = await check.supabase
        .from('project_assignments')
        .update(updateData)
        .eq('id', input.id)
        .select('*, profiles(id, full_name, email, role, avatar_url)')
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${input.project_id}`)

    return {
        success: true,
        data: data as ProjectAssignment,
        message: 'Assignment updated',
    }
}

// ─── REMOVE PM FROM PROJECT ───────────────────────────
export async function removeProjectAssignment(
    id: string,
    projectId: string
): Promise<ActionResult> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    // Get the assignment to check if it's a lead before deleting
    const { data: assignment } = await check.supabase
        .from('project_assignments')
        .select('is_lead, profiles(full_name)')
        .eq('id', id)
        .single()

    const { error } = await check.supabase
        .from('project_assignments')
        .delete()
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${projectId}`)

    const name = (assignment?.profiles as any)?.full_name ?? 'Project manager'
    const leadNote = assignment?.is_lead ? ' (lead designation removed)' : ''

    return {
        success: true,
        data: undefined,
        message: `${name} removed from project${leadNote}`,
    }
}