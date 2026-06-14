// types/index.ts

export type ProjectType =
    | 'residential'
    | 'commercial'
    | 'renovation'
    | 'infrastructure'
    | 'mixed-use'
    | 'institutional'
    | 'industrial'

export type ProjectStatus = 'not-started' | 'in-progress' | 'completed'

export type TimelinePhase = {
    phase: string         // e.g. "Design & Planning"
    startDate: string     // ISO date string "YYYY-MM-DD"
    endDate: string       // ISO date string "YYYY-MM-DD"
    status: 'pending' | 'in-progress' | 'completed'
    description?: string
}

export type PartnerSocial = {
    name: string    // e.g. facebook, instagram, tiktok, etc
    logo: string
}

export type Partner = {
    name: string
    contact_info?: string // e.g. email or phone number
    role: string          // e.g. "Structural Engineer", "Architect", "MEP Consultant"
    logo?: string         // URL or Supabase Storage path
    website?: string      // website for a partner
    socials?: PartnerSocial[]
}

export type Project = {
    id: string
    name: string
    slug: string
    type: ProjectType
    description: string
    location: string
    started_date: string  // ISO date string "YYYY-MM-DD"
    status: ProjectStatus
    featured: boolean
    cover_img: string     // URL or Supabase Storage path
    gallery: string[]     // Array of URLs or Storage paths
    partners: Partner[]
    timeline: TimelinePhase[]
    tags?: string[]       // e.g. ["high-rise", "government", "eco-friendly"]
    client?: string       // Client or organisation name
    area_sqm?: number     // Built area in square metres
    value_usd?: number    // Approximate project value in USD (optional, for internal use)
}