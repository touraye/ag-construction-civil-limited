import { createClient } from '@/lib/supabase/server'

export async function getFeaturedTestimonials() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6)

    if (error) throw error
    return data
}