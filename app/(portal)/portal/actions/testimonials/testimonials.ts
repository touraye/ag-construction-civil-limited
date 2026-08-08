'use server'

import { revalidatePath } from 'next/cache'
import { checkEditorOrAdmin } from '@/lib/auth/role-check'
import type { ActionResult } from '@/types/actions'
import type { CreateTestimonialInput, Testimonial } from '@/types'

// ─── GET ALL TESTIMONIALS ────────────────────────────
export async function getAllTestimonials(): Promise<ActionResult<Testimonial[]>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }

    return { success: true, data: data as Testimonial[] }
}

export async function createTestimonial(
    input: CreateTestimonialInput
): Promise<ActionResult<Testimonial>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    if (!input.quote.trim()) {
        return { success: false, error: 'Quote cannot be empty' }
    }
    if (!input.name.trim()) {
        return { success: false, error: 'Client name is required' }
    }

    const { data, error } = await check.supabase
        .from('testimonials')
        .insert(input)
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/portal/testimonials')
    revalidatePath('/')   // homepage testimonials section

    return {
        success: true,
        data: data as Testimonial,
        message: 'Testimonial added successfully',
    }
}

// ─── UPDATE TESTIMONIAL ──────────────────────────────
export type UpdateTestimonialInput = Partial<CreateTestimonialInput> & { id: string }

export async function updateTestimonial(
    input: UpdateTestimonialInput
): Promise<ActionResult<Testimonial>> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { id, ...fields } = input

    if (fields.quote !== undefined && !fields.quote.trim()) {
        return { success: false, error: 'Quote cannot be empty' }
    }
    if (fields.name !== undefined && !fields.name.trim()) {
        return { success: false, error: 'Client name is required' }
    }

    const { data, error } = await check.supabase
        .from('testimonials')
        .update(fields)
        .eq('id', id)
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/portal/testimonials')
    revalidatePath('/')

    return {
        success: true,
        data: data as Testimonial,
        message: 'Testimonial updated successfully',
    }
}

// ─── DELETE TESTIMONIAL ──────────────────────────────
export async function deleteTestimonial(id: string): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { error } = await check.supabase.from('testimonials').delete().eq('id', id)
    if (error) return { success: false, error: error.message }

    revalidatePath('/portal/testimonials')
    revalidatePath('/')

    return { success: true, data: undefined, message: 'Testimonial deleted' }
}

// ─── TOGGLE FEATURED ──────────────────────────────────
export async function toggleTestimonialFeatured(
    id: string,
    featured: boolean
): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { error } = await check.supabase
        .from('testimonials')
        .update({ featured })
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/portal/testimonials')
    revalidatePath('/')

    return {
        success: true,
        data: undefined,
        message: featured ? 'Added to homepage' : 'Removed from homepage',
    }
}

// ─── TOGGLE PUBLISHED ─────────────────────────────────
export async function toggleTestimonialPublished(
    id: string,
    published: boolean
): Promise<ActionResult> {
    const check = await checkEditorOrAdmin()
    if (!check.ok) return { success: false, error: check.error }

    if (!check.isSuperAdmin && check.contentPermission === 'view') {
        return { success: false, error: 'You have view-only access to content' }
    }

    const { error } = await check.supabase
        .from('testimonials')
        .update({ published })
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/portal/testimonials')
    revalidatePath('/')

    return {
        success: true,
        data: undefined,
        message: published ? 'Testimonial published' : 'Testimonial unpublished',
    }
}