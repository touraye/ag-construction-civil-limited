import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Use getUser() here — makes a network call but guarantees
    // the session is still valid (catches logouts, revoked tokens etc.)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return <div>Welcome, {profile?.full_name}</div>
}