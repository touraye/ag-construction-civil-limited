import {
    getAllTestimonials,    
} from '@/app/(portal)/portal/actions/testimonials/testimonials'
import TestimonialsPageClient from '@/components/portal/testimonials/testimonials-page-client'

export default async function TestimonialsPage() {
    const result = await getAllTestimonials()

    return (
        <TestimonialsPageClient result={result} />
    )
}