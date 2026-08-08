/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/utils/get-error-message'

export default function ForgotPasswordPage() {
    const [ email, setEmail ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)
    const [ submitted, setSubmitted ] = useState(false)

    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })
            console.log('Reset error details:', {
                name: resetError?.name,
                message: resetError?.message,
                status: (resetError as any).status,
                code: (resetError as any).code,
            })            
            if (resetError) throw resetError

            // Always show success, regardless of whether the email exists —
            // this prevents leaking which emails are registered in the system
            setSubmitted(true)
        } catch (err) {
            const message = getErrorMessage(err, 'Something went wrong. Please try again.')
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <h1 className="font-display text-3xl text-brand-white mb-3">Check your email</h1>
                    <p className="text-brand-light text-sm leading-relaxed mb-8">
                        If an account exists for <span className="text-brand-offwhite">{email}</span>,
                        we&apos;ve sent a link to reset your password. The link will expire in 1 hour.
                    </p>
                    <Link
                        href="/auth/login"
                        className="text-sm text-brand-blue hover:text-blue-light transition"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="font-display text-4xl text-brand-white mb-2">Reset Password</h1>
                    <p className="text-brand-light text-sm">
                        Enter your email and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-brand-charcoal border border-white/10 rounded-sm text-brand-white placeholder-brand-mid focus:border-brand-blue focus:outline-none transition"
                            placeholder="you@ironclad.gm"
                            disabled={isLoading}
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-500 text-white font-cond font-semibold tracking-wide uppercase rounded-sm hover:bg-blue-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm text-brand-light hover:text-white transition"
                        >
                            ← Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}