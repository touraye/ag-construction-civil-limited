'use server'

import { revalidatePath } from 'next/cache'
import { checkSuperAdmin } from '@/lib/auth/role-check'
import { generateShareToken } from '@/utils/share-token'
import type { ActionResult } from '@/types/actions'
import type { ProjectShareToken } from '@/types'

// ─── GET ALL TOKENS FOR A PROJECT ────────────────────
export async function getProjectShareTokens(
    projectId: string
): Promise<ActionResult<ProjectShareToken[]>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('project_share_tokens')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }

    return { success: true, data: data as ProjectShareToken[] }
}

// ─── GENERATE NEW SHARE TOKEN ─────────────────────────
export type CreateShareTokenInput = {
    project_id: string
    label?: string
    include_financials: boolean
    validity_hours: number   // e.g. 24, 48, 168 (7 days), 720 (30 days)
    max_uses?: number
}

export async function createShareToken(
    input: CreateShareTokenInput
): Promise<ActionResult<ProjectShareToken>> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const token = generateShareToken()
    const expiresAt = new Date(Date.now() + input.validity_hours * 60 * 60 * 1000)

    const { data, error } = await check.supabase
        .from('project_share_tokens')
        .insert({
            project_id: input.project_id,
            token,
            label: input.label,
            include_financials: input.include_financials,
            expires_at: expiresAt.toISOString(),
            max_uses: input.max_uses ?? null,
            created_by: check.userId,
        })
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${input.project_id}`)

    return {
        success: true,
        data: data as ProjectShareToken,
        message: 'Share link generated',
    }
}

// ─── REVOKE TOKEN ──────────────────────────────────────
export async function revokeShareToken(
    id: string,
    projectId: string
): Promise<ActionResult> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const { error } = await check.supabase
        .from('project_share_tokens')
        .update({ revoked: true })
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${projectId}`)

    return { success: true, data: undefined, message: 'Share link revoked' }
}


// ─── CHECK TOKEN (read-only, no increment) ────────────
// Used by the entry page just to decide whether to redirect.
// Does NOT consume a use.
export async function checkShareTokenValidity(
    projectId: string,
    token: string
): Promise<ActionResult<{ valid: true }>> {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('project_share_tokens')
        .select('*')
        .eq('project_id', projectId)
        .eq('token', token)
        .single()

    if (error || !data) {
        return { success: false, error: 'Invalid access code' }
    }

    if (data.revoked) {
        return { success: false, error: 'This access link has been revoked' }
    }

    if (new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'This access code has expired' }
    }

    if (data.max_uses !== null && data.use_count >= data.max_uses) {
        return { success: false, error: 'This access code has reached its usage limit' }
    }

    // No increment here — just confirms the code is currently valid
    return { success: true, data: { valid: true } }
}


// ─── CONSUME TOKEN (validates AND increments) ──────────
// Used only when actually serving the report data —
// this is the one true "use" of the code.
export async function consumeShareToken(
    projectId: string,
    token: string
): Promise<ActionResult<{ shareToken: ProjectShareToken }>> {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('project_share_tokens')
        .select('*')
        .eq('project_id', projectId)
        .eq('token', token)
        .single()

    if (error || !data) {
        return { success: false, error: 'Invalid access code' }
    }

    if (data.revoked) {
        return { success: false, error: 'This access link has been revoked' }
    }

    if (new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'This access code has expired' }
    }

    if (data.max_uses !== null && data.use_count >= data.max_uses) {
        return { success: false, error: 'This access code has reached its usage limit' }
    }

    // Increment exactly once, here, when data is actually served
    await supabase
        .from('project_share_tokens')
        .update({ use_count: data.use_count + 1 })
        .eq('id', data.id)

    return { success: true, data: { shareToken: data as ProjectShareToken } }
}