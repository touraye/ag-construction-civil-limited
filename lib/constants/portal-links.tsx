import type { UserRole } from '@/context/portal-auth-context'
import {
    LayoutDashboard,
    FolderKanban,
    Wrench,
    MessageSquareQuote,
    Handshake,
    Users,
    Settings,
} from 'lucide-react'

export type PortalLink = {
    name: string
    href: string
    icon: React.ElementType
    roles: UserRole[]   // which roles can see this link
}

export const PORTAL_LINKS: PortalLink[] = [
    {
        name: 'Dashboard',
        href: '/portal/dashboard',
        icon: LayoutDashboard,
        roles: [ 'super_admin', 'project_manager', 'editor', 'viewer' ],
    },
    {
        name: 'Projects',
        href: '/portal/projects',
        icon: FolderKanban,
        roles: [ 'super_admin', 'project_manager' ],
    },
    {
        name: 'Services',
        href: '/portal/services',
        icon: Wrench,
        roles: [ 'super_admin', 'editor' ],
    },
    {
        name: 'Testimonials',
        href: '/portal/testimonials',
        icon: MessageSquareQuote,
        roles: [ 'super_admin', 'editor' ],
    },
    {
        name: 'Works With',
        href: '/portal/works-with',
        icon: Handshake,
        roles: [ 'super_admin' ],
    },
    {
        name: 'Users',
        href: '/portal/users',
        icon: Users,
        roles: [ 'super_admin' ],
    },
    {
        name: 'Settings',
        href: '/portal/settings',
        icon: Settings,
        roles: [ 'super_admin' ],
    },
]