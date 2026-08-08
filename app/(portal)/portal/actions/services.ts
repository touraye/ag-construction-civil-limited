'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import type { Service } from '@/types'
import { checkEditorOrAdmin } from '@/lib/auth/role-check'

type ActionResult<T = undefined> =
    | { success: true; data: T; message?: string }        
    | { success: false; error: string }    


// ─── GET ALL SERVICES ───────────────────────────────
export async function getAllServices(): Promise<ActionResult<Service[]>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    const { data, error } = await check.supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {        
        return { success: false, error: error.message }
    }
    
    return { success: true, data: data as Service[] }
}


// ─── CREATE SERVICE ──────────────────────────────────
export type CreateServiceInput = {
    title: string
    tagline?: string
    icon: string
    description?: string
    long_desc?: string
    order_index: number
    published: boolean
}

export async function createService(input: CreateServiceInput): Promise<ActionResult<Service>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }    

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const slug = slugify(input.title, { lower: true, strict: true })

    const { data, error } = await check.supabase
        .from('services')
        .insert({ ...input, slug })
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/portal/services')
    revalidatePath('/services')   // public services page
    revalidatePath('/')           // homepage services section

    return { success: true, data: data as Service, message: 'New service added successfully' }
}

// ─── UPDATE SERVICE ──────────────────────────────────
export type UpdateServiceInput = Partial<CreateServiceInput> & { id: string }

export async function updateService(input: UpdateServiceInput): Promise<ActionResult<Service>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { id, ...fields } = input

    const updateData: Record<string, unknown> = { ...fields }
    if (fields.title) {
        updateData.slug = slugify(fields.title, { lower: true, strict: true })
    }

    const { data, error } = await check.supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/portal/services')
    revalidatePath('/services')
    revalidatePath('/')

    return {success: true, data: data as Service, message: 'Service updated successfully'}
}

// ─── DELETE SERVICE ──────────────────────────────────
export async function deleteService(id: string): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { error } = await check.supabase.from('services').delete().eq('id', id)
    if (error) return {success: false, error: error.message}

    revalidatePath('/portal/services')
    revalidatePath('/services')
    revalidatePath('/')

    return { success: true, data: undefined, message: 'Service deleted successfully' }    
}

// ─── TOGGLE PUBLISHED ────────────────────────────────
export async function toggleServicePublished(id: string, published: boolean): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { error } = await check.supabase
        .from('services')
        .update({ published })
        .eq('id', id)

    if (error) return { success: false, error: error.message }    

    revalidatePath('/portal/services')
    revalidatePath('/services')
    revalidatePath('/')

    return {
        success: true,
        data: undefined,
        message: published ? 'Service published' : 'Service unpublished',
    }
}

// ─── REORDER SERVICES ────────────────────────────────
export async function reorderServices(orderedIds: string[]): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) {
        return { success: false, error: check.error }
    }    

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const results = await Promise.all(
        orderedIds.map((id, index) =>
            check.supabase.from('services').update({ order_index: index + 1 }).eq('id', id)
        )
    )

    const failed = results.find(r => r.error)
    if (failed?.error) return { success: false, error: failed.error.message }

    revalidatePath('/portal/services')
    revalidatePath('/services')
    revalidatePath('/')

    return { success: true, data: undefined, message: 'Service reorder updated' }
}