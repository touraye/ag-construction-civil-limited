'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Testimonial } from '@/types'
import { createTestimonial, updateTestimonial } from '@/app/(portal)/portal/actions/testimonials/testimonials'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSaved: (testimonial: Testimonial) => void
    testimonial: Testimonial | null
}

export default function TestimonialFormModal({ isOpen, onClose, onSaved, testimonial }: Props) {
    const isEdit = !!testimonial

    const [ form, setForm ] = useState({
        quote: '',
        name: '',
        role: '',
        company: '',
        avatar_url: '',
        featured: false,
        published: true,
    })
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    useEffect(() => {
        if (testimonial) {
            setForm({
                quote: testimonial.quote,
                name: testimonial.name,
                role: testimonial.role ?? '',
                company: testimonial.company ?? '',
                avatar_url: testimonial.avatar_url ?? '',
                featured: testimonial.featured,
                published: testimonial.published,
            })
        } else {
            setForm({ quote: '', name: '', role: '', company: '', avatar_url: '', featured: false, published: true })
        }
        setError(null)
    }, [ testimonial, isOpen ])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = isEdit
            ? await updateTestimonial({ id: testimonial!.id, ...form })
            : await createTestimonial(form)

        setLoading(false)

        if (!result.success) {
            setError(result.error)
            toast.error(result.error)
            return
        }

        toast.success(result.message ?? (isEdit ? 'Testimonial updated' : 'Testimonial created'))
        onSaved(result.data)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-brand-charcoal rounded-sm p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="font-display text-2xl text-brand-white mb-6">
                    {isEdit ? 'Edit Testimonial' : 'New Testimonial'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Quote">
                        <textarea
                            rows={4} required value={form.quote}
                            onChange={e => setForm({ ...form, quote: e.target.value })}
                            className="input resize-none"
                            placeholder="What the client said..."
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Client Name">
                            <input
                                type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input"
                                placeholder="e.g. James Mensah"
                            />
                        </Field>
                        <Field label="Role">
                            <input
                                type="text" value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                className="input"
                                placeholder="e.g. CEO"
                            />
                        </Field>
                    </div>

                    <Field label="Company">
                        <input
                            type="text" value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                            className="input"
                            placeholder="e.g. Metrocorp Group"
                        />
                    </Field>

                    <Field label="Avatar URL (optional)">
                        <input
                            type="text" value={form.avatar_url}
                            onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                            className="input"
                            placeholder="https://..."
                        />
                    </Field>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-brand-light cursor-pointer">
                            <input
                                type="checkbox" checked={form.featured}
                                onChange={e => setForm({ ...form, featured: e.target.checked })}
                            />
                            Feature on homepage
                        </label>
                        <label className="flex items-center gap-2 text-sm text-brand-light cursor-pointer">
                            <input
                                type="checkbox" checked={form.published}
                                onChange={e => setForm({ ...form, published: e.target.checked })}
                            />
                            Published
                        </label>
                    </div>

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
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Testimonial'}
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