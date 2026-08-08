'use server'

import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/actions'
import type { PhasePayment, ProjectPhase } from '@/types'
import { checkFinanceAccess, checkSuperAdmin } from '@/lib/auth/role-check'


// ─── GET PAYMENTS FOR A PHASE ────────────────────────
export async function getPhasePayments(
    phaseId: string,
    projectId: string
): Promise<ActionResult<PhasePayment[]>> {
    const check = await checkFinanceAccess(projectId, 'read')
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('phase_payments')
        .select('*')
        .eq('phase_id', phaseId)
        .order('paid_on', { ascending: true })

    if (error) return { success: false, error: error.message }

    return { success: true, data: data as PhasePayment[] }
}

// ─── GET ALL PAYMENTS FOR A PROJECT ─────────────────
// Fetches phases with their payments nested — used for the payment dashboard
export async function getProjectPaymentSummary(
    projectId: string
): Promise<ActionResult<ProjectPhase[]>> {
    const check = await checkFinanceAccess(projectId, 'read')
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('project_phases')
        .select('*, phase_payments(*)')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

    if (error) return { success: false, error: error.message }

    return {
        success: true,
        data: (data as any[]).map(phase => ({
            ...phase,
            payments: phase.phase_payments ?? [],
        })) as ProjectPhase[],
    }
}

// ─── UPDATE PHASE PRICE ──────────────────────────────
export async function updatePhasePrice(
    phaseId: string,
    price: number,
    projectId: string
): Promise<ActionResult<ProjectPhase>> {
    const check = await checkFinanceAccess(projectId, 'read_write')
    if (!check.ok) return { success: false, error: check.error }

    // ── Validation ─────────────────────────────────────
    if (isNaN(price) || price < 0) {
        return { success: false, error: 'Phase price cannot be negative' }
    }

    // Guard: if payments already recorded, new price can't be less than
    // what's already been paid — that would create an impossible overpayment
    const { data: existingPayments, error: fetchError } = await check.supabase
        .from('phase_payments')
        .select('amount, status')
        .eq('phase_id', phaseId)

    if (fetchError) return { success: false, error: fetchError.message }

    const totalAlreadyPaid = (existingPayments ?? [])
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)

    if (price < totalAlreadyPaid) {
        return {
            success: false,
            error: `Phase price cannot be less than what has already been paid (${totalAlreadyPaid.toLocaleString('en-GM', { style: 'currency', currency: 'GMD' })})`,
        }
    }
    // ── End Validation ──────────────────────────────────

    const { data, error } = await check.supabase
        .from('project_phases')
        .update({ price })
        .eq('id', phaseId)
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects/${data.project_id}`)

    return {
        success: true,
        data: data as ProjectPhase,
        message: 'Phase price updated',
    }
}

// ─── ADD PAYMENT ─────────────────────────────────────
export type AddPaymentInput = {
    phase_id: string
    amount: number
    paid_on: string
    status: 'pending' | 'paid'
    note?: string
}

export async function addPhasePayment(
    input: AddPaymentInput,
    projectId: string
): Promise<ActionResult<PhasePayment>> {
    const check = await checkFinanceAccess(projectId, 'read_write')
    if (!check.ok) return { success: false, error: check.error }

    // Rule 2: payment amount must be positive
    if (isNaN(input.amount) || input.amount <= 0) {
        return { success: false, error: 'Payment amount must be greater than zero' }
    }


    // Fetch the phase to get its price and check existing payments
    const { data: phase, error: phaseError } = await check.supabase
        .from('project_phases')
        .select('price, phase')
        .eq('id', input.phase_id)
        .single()

    if (phaseError || !phase) {
        return { success: false, error: 'Phase not found' }
    }

    const { data: existingPayments, error: paymentsError } = await check.supabase
        .from('phase_payments')
        .select('amount, status')
        .eq('phase_id', input.phase_id)

    if (paymentsError) return { success: false, error: paymentsError.message }

    const totalPaid = (existingPayments ?? [])
        .reduce((sum, p) => sum + p.amount, 0)

    const phasePrice = phase.price ?? 0

    // Rule 4: no payments if phase is already fully paid
    if (totalPaid >= phasePrice && phasePrice > 0) {
        return {
            success: false,
            error: `"${phase.phase}" is fully paid. No further payments can be recorded.`,
        }
    }

    // Rule 3: new payment cannot push total over the phase price
    const remainingBalance = phasePrice - totalPaid
    if (input.amount > remainingBalance) {
        return {
            success: false,
            error: `Payment of ${input.amount.toLocaleString('en-GM', { style: 'currency', currency: 'GMD' })} exceeds the remaining balance of ${remainingBalance.toLocaleString('en-GM', { style: 'currency', currency: 'GMD' })} for "${phase.phase}"`,
        }
    }

    // ── End Validation ──────────────────────────────────

    const { data, error } = await check.supabase
        .from('phase_payments')
        .insert({ ...input, created_by: check.userId })
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects`)

    return {
        success: true,
        data: data as PhasePayment,
        message: 'Payment recorded successfully',
    }
}

// ─── UPDATE PAYMENT ───────────────────────────────────
export async function updatePhasePayment(
    id: string,
    input: Partial<AddPaymentInput>,
    projectId: string
): Promise<ActionResult<PhasePayment>> {
    const check = await checkFinanceAccess(projectId, 'read_write')
    if (!check.ok) return { success: false, error: check.error }

    const { data, error } = await check.supabase
        .from('phase_payments')
        .update(input)
        .eq('id', id)
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects`)

    return {
        success: true,
        data: data as PhasePayment,
        message: 'Payment updated',
    }
}

// ─── MARK PAYMENT AS PAID ─────────────────────────────
export async function markPaymentAsPaid(id: string, projectId: string): Promise<ActionResult<PhasePayment>> {
    return updatePhasePayment(id, { status: 'paid' }, projectId)
}

// ─── DELETE PAYMENT ───────────────────────────────────
export async function deletePhasePayment(id: string, projectId: string): Promise<ActionResult> {
    const check = await checkFinanceAccess(projectId, 'read_write')
    if (!check.ok) return { success: false, error: check.error }

    const { error } = await check.supabase
        .from('phase_payments')
        .delete()
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/portal/projects`)

    return {
        success: true,
        data: undefined,
        message: 'Payment deleted',
    }
}