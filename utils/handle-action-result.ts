import type { ActionResult } from '@/types/actions'
import { toast } from 'sonner'

// For actions that return real data (getAllServices, createService, etc.)
export async function unwrapResult<T>(promise: Promise<ActionResult<T>>): Promise<T | null> {
    const result = await promise
    if (!result.success) {
        toast.error(result.error)
        return null
    }
    if (result.message) toast.success(result.message)
    return result.data ?? null
}

// For actions that just succeed/fail (deleteService, toggleServicePublished, reorderServices)
export async function runAction(promise: Promise<ActionResult>): Promise<boolean> {
    const result = await promise
    if (!result.success) {
        toast.error(result.error)
        return false
    }
    toast.success(result.message ?? 'Done')
    return true
}