'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { consumeShareToken } from './share-tokens'
import type { ActionResult } from '@/types/actions'
import type { Project, ProjectPhase } from '@/types'

export type ShareableProjectData = {
    project: Pick<Project, 'id' | 'name' | 'type' | 'location' | 'status' | 'started_date' | 'description' | 'cover_img'>
    phases: (Pick<ProjectPhase, 'id' | 'phase' | 'description' | 'start_date' | 'end_date' | 'status' | 'order_index'> & {
        price?: number
        amountPaid?: number
    })[]
    financials: {
        included: boolean
        contractValue?: number
        totalPaid?: number
        outstanding?: number
    }
}

export async function getShareableProjectData(
    projectId: string,
    token: string
): Promise<ActionResult<ShareableProjectData>> {
    // This is the ONLY place the use_count is incremented —
    // exactly once, when the report data is actually fetched
    const validation = await consumeShareToken(projectId, token)
    if (!validation.success) return { success: false, error: validation.error }

    const { include_financials } = validation.data.shareToken

    const supabase = createAdminClient()

    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, name, type, location, status, started_date, description, cover_img')
        .eq('id', projectId)
        .single()

    if (projectError || !project) {
        return { success: false, error: 'Project not found' }
    }

    const { data: phases, error: phasesError } = await supabase
        .from('project_phases')
        .select('id, phase, description, start_date, end_date, status, order_index, price, phase_payments(amount, status)')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

    if (phasesError) {
        return { success: false, error: phasesError.message }
    }

    const enrichedPhases = (phases ?? []).map(p => {
        const amountPaid = include_financials
            ? (p.phase_payments ?? [])
                .filter((pay: any) => pay.status === 'paid')
                .reduce((sum: number, pay: any) => sum + pay.amount, 0)
            : undefined

        return {
            id: p.id,
            phase: p.phase,
            description: p.description,
            start_date: p.start_date,
            end_date: p.end_date,
            status: p.status,
            order_index: p.order_index,
            price: include_financials ? p.price : undefined,
            amountPaid,
        }
    })

    let financials: ShareableProjectData[ 'financials' ] = { included: false }

    if (include_financials) {
        const contractValue = enrichedPhases.reduce((sum, p) => sum + (p.price ?? 0), 0)
        const totalPaid = enrichedPhases.reduce((sum, p) => sum + (p.amountPaid ?? 0), 0)

        financials = {
            included: true,
            contractValue,
            totalPaid,
            outstanding: contractValue - totalPaid,
        }
    }

    return {
        success: true,
        data: {
            project: project as ShareableProjectData[ 'project' ],
            phases: enrichedPhases,
            financials,
        },
    }
}