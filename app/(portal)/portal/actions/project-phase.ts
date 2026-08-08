'use server'

import { checkProjectMgtOrAdmin } from '@/lib/auth/role-check'
import { PhaseStatus, ProjectPhase } from '@/types'
import { ActionResult } from '@/types/actions'
import { revalidatePath } from 'next/cache'

export type ProjectPhaseInput = {
    project_id: string
    phase: string
    price: number // milestone value
    description?: string
    start_date?: string
    end_date?: string
    status: 'pending' | 'in-progress' | 'completed'
    order_index: number
}

// app/portal/actions/projectPhases.ts
export async function addProjectPhase(    
  input: ProjectPhaseInput
): Promise<ActionResult<ProjectPhase>> {
    console.log("ProjectID", input.project_id, "Adding project phase with input:", input);
    const check = await checkProjectMgtOrAdmin(input.project_id)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

  const { supabase } = check

  const { data, error } = await supabase
    .from('project_phases')
    .insert(input)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/portal/projects/${input.project_id}`)

  return {
    success: true,
    data: data as ProjectPhase,
    message: 'Phase added successfully',
  }
}

export async function updateProjectPhase(
    id: string,
    projectId: string,
    input: Partial<ProjectPhaseInput>
): Promise<ActionResult<ProjectPhase>> {
    const check = await checkProjectMgtOrAdmin(projectId)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const { data, error } = await supabase
        .from('project_phases')
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
        data: data as ProjectPhase,
        message: 'Phase updated successfully',
    }
}

// Quick status update — used for the one-click PM workflow
export async function updatePhaseStatus(
    id: string,
    projectId: string,
    status: PhaseStatus
): Promise<ActionResult<ProjectPhase>> {
    return updateProjectPhase(id, projectId, { status })
}

export async function removeProjectPhase(
    id: string,
    projectId: string
): Promise<ActionResult> {
    const check = await checkProjectMgtOrAdmin(projectId)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const { error } = await supabase.from('project_phases').delete().eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath(`/portal/projects/${projectId}`)

    return {
        success: true,
        data: undefined,
        message: 'Phase removed successfully',
    }
}

export async function reorderProjectPhases(
    projectId: string,
    orderedIds: string[]
): Promise<ActionResult> {
    const check = await checkProjectMgtOrAdmin(projectId)  // or input.project_id
    if (!check.ok) return { success: false, error: check.error }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const { supabase } = check

    const results = await Promise.all(
        orderedIds.map((id, index) =>
            supabase.from('project_phases').update({ order_index: index + 1 }).eq('id', id)
        )
    )

    const failed = results.find(r => r.error)
    if (failed?.error) {
        return { success: false, error: failed.error.message }
    }

    revalidatePath(`/portal/projects/${projectId}`)

    return {
        success: true,
        data: undefined,
        message: 'Phase order updated',
    }
}