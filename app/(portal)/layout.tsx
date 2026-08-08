import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { PortalAuthProvider, type PortalUser } from '@/context/portal-auth-context'


import { ThemeProvider } from "@/components/theme-provider"

import { Header } from "@/components/portal/header"
import { Sidebar } from "@/components/portal/sidebar"
import { Toaster } from '@/components/ui/sonner'


export const metadata = {
    title: 'Portal',
    description: 'Portal dashboard',
}

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
    }) {      
    
    const supabase = await createClient()

    // Double-check the user is still authenticated
    const { data: { user }, error } = await supabase.auth.getUser()   
    console.log("PortalLayout user data:", user?.user_metadata?.full_name, user?.email, user?.id, error);
    const {user_metadata} = user || {};
    

    if (error || !user) {
        redirect('/auth/login')
}

    // Fetch user profile with role
    // const { data: profile } = await supabase
    //     .from('profiles')
    //     .select('role, full_name, avatar_url')
    //     .eq('id', user.id)
    //     .single()

    // if (!profile) {
    //     redirect('/auth/login')
    //     console.error('User profile not found for user ID:', user)
    // }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, avatar_url, is_active')
        .eq('id', user.id)
        .single()

    const portalUser: PortalUser = {
        id: profile?.id,
        email: profile?.email,
        full_name: profile?.full_name,
        role: profile?.role,
        avatar_url: profile?.avatar_url,
    }

    return (
        <>  
            <PortalAuthProvider user={portalUser}>
                <ThemeProvider
                attribute="class" // <--- Tells next-themes to toggle the .dark class
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
            <div className="flex h-screen w-full overflow-hidden bg-[#F5F7FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100">

                {/* Desktop Sidebar (Hidden on mobile) */}
                <aside className="hidden md:block w-64 lg:w-72 shrink-0 h-full">
                    <Sidebar />
                </aside>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">

                    {/* Top Header Navigation */}
                        <Header user_metadata={user_metadata} />

                    {/* Scrollable Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {/* Framer Motion page transitions could be added here if desired */}
                        {children}
                    </main>
                            
                    <Toaster richColors position="top-right" theme="dark" />
                </div>

            </div>
                </ThemeProvider>
            </PortalAuthProvider>
        </>
    )
}