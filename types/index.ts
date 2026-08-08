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
export type PhaseStatus = 'pending' | 'in-progress' | 'completed' // newly used by data coming from Supabase

export type TimelinePhase = {
    phase: string         // e.g. "Design & Planning"
    startDate: string     // ISO date string "YYYY-MM-DD"
    endDate: string       // ISO date string "YYYY-MM-DD"
    status: PhaseStatus
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

export type ProjectPermission = 'view' | 'edit'
export type ContentPermission = 'view' | 'edit' 

export type ProjectAssignmentMeta = {
    id: string
    user_id: string
    is_lead: boolean
    project_permission: ProjectPermission
    finance_permission: FinancePermission
}

export type _Project = { // newly type base on the data coming from Supabase
    id: string
    name: string
    slug: string
    type: ProjectType
    description: string | null
    location: string
    client: string | null
    area_sqm: number | null
    started_date: string | null
    status: ProjectStatus
    featured: boolean
    published: boolean
    cover_img: string | null
    gallery: string[]
    tags: string[]
    created_at: string
    updated_at: string
    project_assignments?: ProjectAssignmentMeta[] // optional, loaded when needed
}


export type _ProjectPartner = { // newly type base on the data coming from Supabase
    id: string
    project_id: string
    name: string
    logo_url: string | null
    website: string | null
    expertise: string
    role: string
    contact_name: string | null
    contact_email: string | null
    contact_phone: string | null
    contract_value: number | null
    active: boolean
    created_at: string
    updated_at: string
}

export type ProjectPhase = {
    id: string
    project_id: string
    phase: string
    description: string | null
    start_date: string | null
    end_date: string | null
    status: PhaseStatus
    order_index: number
    price: number           // milestone value
    created_at: string
    updated_at: string
    payments?: PhasePayment[]  // optional, loaded when needed
}

// Computed client-side, never stored
export function getProjectProgress(phases: ProjectPhase[]): number {
    if (!phases || phases.length === 0) return 0
    const completed = phases.filter(p => p.status === 'completed').length
    return Math.round((completed / phases.length) * 100)
}



// types/index.ts

export type UserRole = 'super_admin' | 'project_manager' | 'editor' | 'viewer'

export type Profile = {
    id: string
    email: string
    full_name: string | null
    role: UserRole
    avatar_url: string | null
    is_active: boolean
    last_sign_in_at: string | null
    created_at: string
    updated_at: string
}


// ─── WORKS WITH ────────────────────────────────────
export type WorksWithRelationship = 'partner' | 'client' | 'subcontractor'

export type WorksWith = {
    id: string
    name: string
    logo_url: string | null
    website: string | null
    description: string | null
    relationship: WorksWithRelationship
    active: boolean
    order_index: number
    created_at: string
    updated_at: string
}

// ─── PROJECT PARTNERS ──────────────────────────────
export type ProjectPartner = {
    id: string
    project_id: string
    name: string
    logo_url: string | null
    website: string | null
    expertise: string
    role: string
    contact_name: string | null
    contact_email: string | null
    contact_phone: string | null
    contract_value: number | null        // Never expose this publicly
    active: boolean
    created_at: string
    updated_at: string
}


// newly created Serivce types for Supabase data
export type Service = {
    id: string
    title: string
    slug: string
    tagline: string | null
    icon: string | null
    description: string | null
    long_desc: string | null
    order_index: number
    published: boolean
    created_at: string
    updated_at: string
}

// types/index.ts

export type PaymentStatus = 'pending' | 'paid'

export type PhasePayment = {
    id: string
    phase_id: string
    amount: number
    paid_on: string
    status: PaymentStatus
    note: string | null
    created_by: string | null
    created_at: string
    updated_at: string
}

// Types for project assignments and finance permissions

export type FinancePermission = 'read' | 'read_write' | 'read_write_delete' | null

export type ProjectAssignment = {
    id: string
    project_id: string
    user_id: string
    is_lead: boolean
    project_permission?: ProjectPermission
    finance_permission: FinancePermission
    assigned_at: string
    // Joined fields — available when fetched with select('*, profiles(*)')
    profiles?: {
        id: string
        full_name: string | null
        email: string
        role: string
        avatar_url: string | null
    }
}


// types for Project Share with clients

export type ProjectShareToken = {
  id: string
  project_id: string
  token: string
  label: string | null
  include_financials: boolean
  expires_at: string
  max_uses: number | null
  use_count: number
  created_by: string | null
  revoked: boolean
  created_at: string
}


//* TESTIMONIALS
// types/index.ts

export type Testimonial = {
    id: string
    quote: string
    name: string
    role: string | null
    company: string | null
    avatar_url: string | null
    project_id: string | null
    featured: boolean
    published: boolean
    created_at: string
    updated_at: string    
}

export type CreateTestimonialInput = {
    quote: string
    name: string
    role?: string
    company?: string
    avatar_url?: string
    featured: boolean
    published: boolean
}