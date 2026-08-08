'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/utils/get-error-message'

export default function ResetPasswordPage() {
    const router = useRouter()
    const supabase = createClient()

    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)
    const [ sessionReady, setSessionReady ] = useState(false)
    const [ sessionError, setSessionError ] = useState<string | null>(null)

    // Confirm a recovery session actually exists before showing the form.
    // If the user landed here without a valid token (expired link, direct
    // navigation, link already used), there's no session — show an error
    // instead of a broken form.
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setSessionError('This password reset link is invalid or has expired. Please request a new one.')
            }
            setSessionReady(true)
        })
    }, [ supabase ])

    function validatePassword(): string | null {
        if (password.length < 8) {
            return 'Password must be at least 8 characters'
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match'
        }
        return null
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const validationError = validatePassword()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password })

            if (updateError) throw updateError

            toast.success('Password updated successfully')

            // Sign out to force a fresh login with the new password —
            // safer than silently continuing on the short-lived recovery session
            await supabase.auth.signOut()
            router.push('/auth/login')
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to update password. Please try again.')
            setError(message)
            toast.error(message)
            setIsLoading(false)
        }
    }

    if (!sessionReady) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <p className="text-brand-light text-sm">Verifying link...</p>
            </div>
        )
    }

    if (sessionError) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <h1 className="font-display text-3xl text-brand-white mb-3">Link Expired</h1>
                    <p className="text-brand-light text-sm leading-relaxed mb-8">{sessionError}</p>
                    <a
                        href="/auth/forgot-password"
                        className="text-sm text-brand-blue hover:text-blue-light transition"
                    >
                        Request a new link
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="font-display text-4xl text-brand-white mb-2">Set New Password</h1>
                    <p className="text-brand-light text-sm">
                        Choose a strong password for your IRONCLAD portal account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-brand-charcoal border border-white/10 rounded-sm text-brand-white placeholder-brand-mid focus:border-brand-blue focus:outline-none transition"
                            placeholder="••••••••"
                            disabled={isLoading}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-brand-charcoal border border-white/10 rounded-sm text-brand-white placeholder-brand-mid focus:border-brand-blue focus:outline-none transition"
                            placeholder="••••••••"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <p className="text-xs text-brand-mid">Must be at least 8 characters.</p>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-brand-blue text-white font-cond font-semibold tracking-wide uppercase rounded-sm hover:bg-blue-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}