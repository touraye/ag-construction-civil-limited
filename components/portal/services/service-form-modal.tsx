'use client'

import { useState, useEffect } from 'react'
import type { Service } from '@/types'
import { toast } from 'sonner'
import { createService, updateService } from '@/app/(portal)/portal/actions/services'
import IconPicker from './icon-picker'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSaved: (service: Service) => void
    service: Service | null
    nextOrderIndex: number
}

export default function ServiceFormModal({ isOpen, onClose, onSaved, service, nextOrderIndex }: Props) {
    const isEdit = !!service

    const [ form, setForm ] = useState({
        title: '',
        tagline: '',
        icon: 'home',
        description: '',
        long_desc: '',
        published: true,
    })
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    useEffect(() => {
        if (service) {
            setForm({
                title: service.title,
                tagline: service.tagline ?? '',
                icon: service.icon ?? 'home',
                description: service.description ?? '',
                long_desc: service.long_desc ?? '',
                published: service.published,
            })
        } else {
            setForm({ title: '', tagline: '', icon: 'home', description: '', long_desc: '', published: true })
        }
        setError(null)
    }, [ service, isOpen ])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = isEdit
            ? await updateService({ id: service!.id, ...form })
            : await createService({ ...form, order_index: nextOrderIndex })
        
        setLoading(false)

        if (!result.success) {
            setError(result.error)
            toast.error(result.error)
            return
        }

        toast.success(result.message ?? (isEdit ? 'Service updated' : 'Service created'))
        onSaved(result.data)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-brand-charcoal rounded-sm p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="font-display text-2xl text-brand-white mb-6">
                    {isEdit ? 'Edit Service' : 'New Service'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Title">
                        <input
                            type="text" required value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="input"
                            placeholder="e.g. Residential"
                        />
                    </Field>

                    <Field label="Tagline">
                        <input
                            type="text" value={form.tagline}
                            onChange={e => setForm({ ...form, tagline: e.target.value })}
                            className="input"
                            placeholder="e.g. Homes built to last generations."
                        />
                    </Field>

                    <Field label="Icon">
                        <IconPicker value={form.icon} onChange={icon => setForm({ ...form, icon })} />
                    </Field>

                    <Field label="Short Description">
                        <textarea
                            rows={2} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="input resize-none"
                            placeholder="One-line summary shown in service cards"
                        />
                    </Field>

                    <Field label="Full Description">
                        <textarea
                            rows={5} value={form.long_desc}
                            onChange={e => setForm({ ...form, long_desc: e.target.value })}
                            className="input resize-none"
                            placeholder="Full paragraph shown on the homepage and service detail page"
                        />
                    </Field>

                    <label className="flex items-center gap-2 text-sm text-brand-light cursor-pointer">
                        <input
                            type="checkbox" checked={form.published}
                            onChange={e => setForm({ ...form, published: e.target.checked })}
                        />
                        Published (visible to public)
                    </label>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button" onClick={onClose}
                            className="flex-1 py-2 border border-white/10 text-brand-light rounded-sm hover:border-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-1 py-2 bg-brand-blue text-white rounded-sm hover:bg-blue-light transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    )
}