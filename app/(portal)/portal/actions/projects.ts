'use server'

import { checkEditorOrAdmin, checkProjectMgtOrAdmin, checkUser } from '@/lib/auth/role-check'

import { _Project, _ProjectPartner, ProjectPhase, ProjectStatus, ProjectType } from '@/types'
import { ActionResult } from '@/types/actions'
import { revalidatePath } from 'next/cache'
import slugify from 'slugify'



// ─── GET ALL PROJECTS (role-aware) ─────────────────
export async function getAllProjects(): Promise<ActionResult<_Project[]>> {

    const check = await checkProjectMgtOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    const {supabase, role} = check

    if (role === 'super_admin') {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) return { success: false, error: error.message }
        return { success: true, data: data as _Project[] }
    }

    if (role === 'project_manager') {
        // Fetch projects the PM is assigned to, including their assignment details
        const { data, error } = await supabase
            .from('projects')
            .select(`
          *,
          project_assignments!inner(
            id,
            user_id,
            is_lead,
            finance_permission
          )
        `)
        .eq('project_assignments.user_id', check.userId)
        .order('created_at', { ascending: false })

        if (error) return { success: false, error: error.message }
        return { success: true, data: data as _Project[] }
    }
    

    return { success: false, error: 'You do not have access to projects' }    
}

// ─── GET SINGLE PROJECT + RELATIONS ────────────────
export async function getProjectById(id: string):
    Promise<ActionResult<{
        project: _Project
        partners: _ProjectPartner[]
        phases: ProjectPhase[]
    }>>  {
        
    const check = await checkProjectMgtOrAdmin()
    if(!check.ok) {
    return { success: false, error: check.error }
    }

    const [ { data: project, error: projectError }, { data: partners, error: partnersError }, { data: phases, error: phasesError } ] =
        await Promise.all([
            check.supabase.from('projects').select('*').eq('id', id).single(),
            check.supabase.from('project_partners').select('*').eq('project_id', id).order('created_at'),
            check.supabase.from('project_phases').select('*').eq('project_id', id).order('order_index'),
        ])

    if (projectError) {
        return { success: false, error: projectError.message }
    }

    if (partnersError) {
        return { success: false, error: partnersError.message }
    }

    if (phasesError) {
        return { success: false, error: phasesError.message }
    }

    return {
        success: true,
        data: {
            project: project as _Project,
            partners: (partners ?? []) as _ProjectPartner[],
            phases: (phases ?? []) as ProjectPhase[],
        },
    }
}

// ─── CREATE PROJECT ─────────────────────────────────
export type CreateProjectInput = {
    name: string
    type: ProjectType
    description?: string
    location: string
    client?: string
    area_sqm?: number
    started_date?: string
    status: ProjectStatus
    featured: boolean
    published: boolean
    cover_img?: string
    gallery?: string[]
    tags?: string[]
}

export async function createProject(input: CreateProjectInput): Promise<ActionResult<_Project>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    } 


    const slug = slugify(input.name, { lower: true, strict: true })

    const { data, error } = await check.supabase
        .from('projects')
        .insert({ ...input, slug })
        .select()
        .single()

    if (error) {
        return {success: false, error: error.message}
    }

    revalidatePath('/portal/projects')
    
    return { success: true, data: data as _Project, message: 'New service added successfully' }
}

// ─── UPDATE PROJECT ─────────────────────────────────
export type UpdateProjectInput = Partial<CreateProjectInput> & { id: string }

export async function updateProject(input: UpdateProjectInput): Promise<ActionResult<_Project>> {
    const check = await checkProjectMgtOrAdmin(input.id)
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    // View-only PMs cannot edit project details
    if (!check.isSuperAdmin && check.projectPermission === 'view') {
        return { success: false, error: 'You have view-only access to this project' }
    }

    const {supabase, userId, role} = check
    const { id, ...fields } = input

    // PM can only update fields on assigned projects — enforced by RLS too,
    // but we double-check here for a clean error message
    if (role === 'project_manager') {
        const { data: assignment } = await supabase
            .from('project_assignments')
            .select('id')
            .eq('project_id', id)
            .eq('user_id', userId)
            .single()

        if (!assignment) {
            return { success: false, error: 'You are not assigned to this project' }
        }
    }

    // role === 'super_admin' falls through with no extra check needed —
    // checkProjectMgtOrAdmin already confirmed it's one of these two roles

    // If name changed, regenerate slug
    const updateData: Record<string, unknown> = { ...fields }
    if (fields.name) {
        updateData.slug = slugify(fields.name, { lower: true, strict: true })
    }

    const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/portal/projects')
    revalidatePath(`/portal/projects/${id}`)

    return {
        success: true,
        data: data as _Project,
        message: 'Project updated successfully',
    }
}

// ─── DELETE PROJECT ─────────────────────────────────
export async function deleteProject(id: string) {
    const check = await checkProjectMgtOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    const {supabase, role} = check

    if (role !== 'super_admin') {
        throw new Error('Only super admins can delete projects')
    }
    

    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/portal/projects')
    return { 
        success: true,
        data: undefined,
        message: 'Project deleted successfully',
    }
}

// ─── TOGGLE PUBLISHED ───────────────────────────────
export async function toggleProjectPublished(id: string, published: boolean) {
    const check = await checkUser()
    if (!check.ok) {
        return {success: false, error: check.error}
    }

    const { supabase, role } = check    

    if (role !== 'super_admin') {        
        return {success: false, error: 'Only super admins can publish or unpublish projects'}
    }

    const { error } = await supabase
        .from('projects')
        .update({ published })
        .eq('id', id)

    if (error) {
        return {success: error}
    }
    revalidatePath('/portal/projects')
    return { 
        success: true,
        data: undefined,
        message: published ? 'Project published' : 'Project unpublished',
     }
}