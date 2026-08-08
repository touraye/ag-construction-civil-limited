'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'
import {
    deleteTestimonial,
    toggleTestimonialFeatured,
    toggleTestimonialPublished,
} from '@/app/(portal)/portal/actions/testimonials/testimonials'
import TestimonialFormModal from './testimonial-form-modal'

interface Props {
    initialTestimonials: Testimonial[]
}

export default function TestimonialsManager({ initialTestimonials }: Props) {
    const [ testimonials, setTestimonials ] = useState(initialTestimonials)
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ editingTestimonial, setEditingTestimonial ] = useState<Testimonial | null>(null)

    function openCreateModal() {
        setEditingTestimonial(null)
        setModalOpen(true)
    }

    function openEditModal(testimonial: Testimonial) {
        setEditingTestimonial(testimonial)
        setModalOpen(true)
    }

    function handleSaved(saved: Testimonial) {
        setTestimonials(prev => {
            const exists = prev.find(t => t.id === saved.id)
            if (exists) return prev.map(t => (t.id === saved.id ? saved : t))
            return [ saved, ...prev ]
        })
        setModalOpen(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this testimonial? This cannot be undone.')) return

        const result = await deleteTestimonial(id)
        if (!result.success) { toast.error(result.error); return }

        toast.success(result.message ?? 'Testimonial deleted')
        setTestimonials(prev => prev.filter(t => t.id !== id))
    }

    async function handleToggleFeatured(testimonial: Testimonial) {
        const newValue = !testimonial.featured
        const result = await toggleTestimonialFeatured(testimonial.id, newValue)
        if (!result.success) { toast.error(result.error); return }

        toast.success(result.message ?? 'Updated')
        setTestimonials(prev =>
            prev.map(t => (t.id === testimonial.id ? { ...t, featured: newValue } : t))
        )
    }

    async function handleTogglePublished(testimonial: Testimonial) {
        const newValue = !testimonial.published
        const result = await toggleTestimonialPublished(testimonial.id, newValue)
        if (!result.success) { toast.error(result.error); return }

        toast.success(result.message ?? 'Updated')
        setTestimonials(prev =>
            prev.map(t => (t.id === testimonial.id ? { ...t, published: newValue } : t))
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <p className="text-brand-mid text-xs">
                    Star a testimonial to feature it on the homepage carousel.
                </p>
                <button
                    onClick={openCreateModal}
                    className="px-6 py-2 bg-brand-blue text-white font-cond font-semibold tracking-wide uppercase rounded-sm hover:bg-blue-light transition"
                >
                    Add Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonials.map(testimonial => (
                    <div
                        key={testimonial.id}
                        className="p-4 border border-white/10 rounded-sm space-y-3 relative"
                    >
                        {/* Featured star toggle — top right */}
                        <button
                            onClick={() => handleToggleFeatured(testimonial)}
                            title={testimonial.featured ? 'Remove from homepage' : 'Feature on homepage'}
                            className="absolute top-4 right-4"
                        >
                            <Star
                                size={18}
                                className={testimonial.featured ? 'fill-brand-blue text-brand-blue' : 'text-brand-mid hover:text-brand-light transition'}
                            />
                        </button>

                        {/* Quote */}
                        <div className="flex gap-2 pr-8">
                            <Quote size={16} className="text-brand-blue flex-shrink-0 mt-1" />
                            <p className="text-brand-offwhite text-sm leading-relaxed line-clamp-3">
                                {testimonial.quote}
                            </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            {testimonial.avatar_url ? (
                                <img
                                    src={testimonial.avatar_url}
                                    alt={testimonial.name}
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-brand-steel flex items-center justify-center font-cond text-sm text-brand-blue font-semibold">
                                    {testimonial.name[ 0 ]?.toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="text-brand-white text-sm font-medium">{testimonial.name}</div>
                                <div className="text-brand-mid text-xs">
                                    {[ testimonial.role, testimonial.company ].filter(Boolean).join(' · ')}
                                </div>
                            </div>
                        </div>

                        {/* Actions row */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <button
                                onClick={() => handleTogglePublished(testimonial)}
                                className={`px-2 py-1 rounded-sm text-xs font-cond uppercase tracking-wide transition ${testimonial.published
                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        : 'bg-brand-mid/20 text-brand-light hover:bg-brand-mid/30'
                                    }`}
                            >
                                {testimonial.published ? 'Published' : 'Draft'}
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => openEditModal(testimonial)}
                                    className="text-sm text-brand-blue hover:text-blue-light transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="text-sm text-red-400 hover:text-red-500 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {testimonials.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-brand-mid text-sm border border-white/10 rounded-sm">
                        No testimonials yet. Click &quot;Add Testimonial&quot; to create your first one.
                    </div>
                )}
            </div>

            <TestimonialFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
                testimonial={editingTestimonial}
            />
        </div>
    )
}