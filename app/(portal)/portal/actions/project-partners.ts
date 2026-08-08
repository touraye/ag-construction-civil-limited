'use server'

import { revalidatePath } from 'next/cache'

import type { ActionResult } from '@/types/actions'
import type { ProjectPartner } from '@/types'
import { checkProjectMgtOrAdmin } from '@/lib/auth/role-check'

export type ProjectPartnerInput = {
    project_id: string
    name: string
    logo_url?: string
    website?: string
    expertise: string
    role: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
    contract_value?: number
    active?: boolean
}

// ─── GET ALL PARTNERS FOR A PROJECT ──────────────────
export async function getAllProjectPartners(
    projectId: string
): Promise<ActionResult<ProjectPartner[]>> {
    const check = await checkProjectMgtOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('project_partners')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

    if (error) return { success: false, error: error.message }

    return {
        success: true,
        data: data as ProjectPartner[],
    }
}

// ─── GET SINGLE PARTNER ───────────────────────────────
export async function getProjectPartner(
    id: string
): Promise<ActionResult<ProjectPartner>> {
    const check = await checkProjectMgtOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('project_partners')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return { success: false, error: error.message }

    if (!data) return { success: false, error: 'Partner not found' }

    return {
        success: true,
        data: data as ProjectPartner,
    }
}

// --- ADD PARTNER ---
export async function addProjectPartner(    
    input: ProjectPartnerInput
): Promise<ActionResult<ProjectPartner>> {
      
    const check = await checkProjectMgtOrAdmin(input.project_id)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const { data, error } = await supabase
        .from('project_partners')
        .insert(input)
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath(`/portal/projects/${input.project_id}`)

    return {
        success: true,
        data: data as ProjectPartner,
        message: 'Partner added successfully',
    }
}

// --- UPDATE PARTNER ---
export async function updateProjectPartner(   
    id: string,
    input: Partial<ProjectPartnerInput>
): Promise<ActionResult<ProjectPartner>> {
    const check = await checkProjectMgtOrAdmin(input.project_id)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }    

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {        
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const { data, error } = await supabase
        .from('project_partners')
        .update(input)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath(`/portal/projects/${data.project_id}`)

    return {
        success: true,
        data: data as ProjectPartner,
        message: 'Partner updated successfully',
    }
}

// --- REMOVE PARTNER ---
export async function removeProjectPartner(
    id: string,
    input: { project_id: string }
): Promise<ActionResult> {
    const check = await checkProjectMgtOrAdmin(input.project_id)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const { error } = await supabase.from('project_partners').delete().eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath(`/portal/projects/${input.project_id}`)

    return {
        success: true,
        data: undefined,
        message: 'Partner removed successfully',
    }
}