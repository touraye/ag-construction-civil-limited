import { PhasePayment, ProjectPhase } from "@/types"

// Computed helpers
export function getPhaseAmountPaid(payments: PhasePayment[]): number {
    return payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)
}

export function getPhaseAmountPending(payments: PhasePayment[]): number {
    return payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0)
}

export function getProjectContractValue(phases: ProjectPhase[]): number {
    return phases.reduce((sum, p) => sum + (p.price ?? 0), 0)
}

export function getProjectTotalPaid(phases: ProjectPhase[]): number {
    return phases.reduce((sum, p) => {
        const paid = p.payments?.filter(pay => pay.status === 'paid')
            .reduce((s, pay) => s + pay.amount, 0) ?? 0
        return sum + paid
    }, 0)
}