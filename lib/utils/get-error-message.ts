
import { AuthError, AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js'

function isNetworkError(err: unknown): boolean {
    return err instanceof TypeError && err.message === 'Failed to fetch'
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
    if (isNetworkError(err)) {
        return 'Unable to reach the server. Check your internet connection and try again.'
    }

    // AuthRetryableFetchError often has an empty .message — give it a specific,
    // useful message instead of falling through to a blank string
    if (err instanceof AuthRetryableFetchError) {
        return 'The server is temporarily unavailable. Please try again in a moment.'
    }

    if (err instanceof AuthApiError) {
        // AuthApiError.message is usually populated and safe to show directly
        return err.message
    }

    if (err instanceof AuthError && err.message) {
        return err.message
    }

    if (err instanceof Error && err.message) {
        return err.message
    }

    // Final safety net — guarantees the UI never renders an empty string
    return fallback
}
