'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import type { ActionResult } from '@/types/actions'
import type { Testimonial } from '@/types'
import TestimonialsManager from './testimonials-manager'

interface Props {
    result: ActionResult<Testimonial[]>
}

export default function TestimonialsPageClient({ result }: Props) {
    useEffect(() => {
        if (!result.success) toast.error(result.error)
    }, [ result ])

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="font-display text-4xl text-brand-white">Testimonials</h1>
                {result.success && (
                    <p className="text-brand-light text-sm mt-1">
                        {result.data.length} testimonial{result.data.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {result.success ? (
                <TestimonialsManager initialTestimonials={result.data} />
            ) : (
                <div className="py-16 text-center border border-white/10 rounded-sm">
                    <p className="text-brand-light text-sm">You don&apos;t have permission to view testimonials.</p>
                </div>
            )}
        </div>
    )
}