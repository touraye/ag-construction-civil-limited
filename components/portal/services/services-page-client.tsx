'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import type { Service } from '@/types'
import ServicesManager from './service-manager'

type Props = {
    result: { success: true; data: Service[] } | { success: false; error: string }
}

export default function ServicesPageClient({ result }: Props) {
    useEffect(() => {
        if (!result.success) toast.error(result.error)
    }, [ result ])

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="font-display text-4xl text-brand-white">Services</h1>
                {result.success && (
                    <p className="text-brand-light text-sm mt-1">
                        {result.data.length} service{result.data.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {result.success ? (
                <ServicesManager initialServices={result.data} />
            ) : (
                <div className="py-16 text-center border border-white/10 rounded-sm">
                    <p className="text-brand-light text-sm">You don&apos;t have permission to view services.</p>
                </div>
            )}
        </div>
    )
}