import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data } = await supabase.auth.getClaims()
    const user = data?.claims

    const isPortalRoute = request.nextUrl.pathname.startsWith('/portal')
    const isLoginPage = request.nextUrl.pathname === '/auth'

    // NEW — these two routes are exempt from the "logged in? skip /auth/*" redirect,
    // since a recovery session is a valid session but the user still needs to reach
    // the reset-password form (and forgot-password should always be reachable too,
    // e.g. an admin wanting to reset a *different* account isn't relevant here,
    // but a user testing the flow while already logged in elsewhere shouldn't be blocked)
    const isExemptAuthRoute =
        request.nextUrl.pathname === '/auth/reset-password' || request.nextUrl.pathname === '/auth/forgot-password'

    // ── Protect /portal/* routes ──────────────────────
    // If no user and trying to access /portal → send to /auth/login
    if (isPortalRoute && !isLoginPage && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        // Add redirect origin so you can send them back after login
        url.searchParams.set('redirect_to', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // ── Already logged in, on /auth/login → send to /portal/dashboard
    if (isLoginPage && !isExemptAuthRoute && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/portal/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}