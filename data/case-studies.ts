export type CaseStudyCategory = "Sustainability" | "Infrastructure" | "Restoration" | "Commercial";

export interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    client: string;
    category: CaseStudyCategory;
    challenge: string;
    impactHighlight: string; // e.g., "40% Energy Reduction"
    coverImage: string;
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        id: "cs-1",
        slug: "eco-tower-sustainability",
        title: "Net-Zero Eco Tower: Redefining Urban Living",
        client: "Global Horizons Real Estate",
        category: "Sustainability",
        challenge: "Design and construct a 50-story commercial skyscraper in a dense urban grid without increasing the local carbon footprint.",
        impactHighlight: "40% Energy Cost Reduction",
        coverImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "cs-2",
        slug: "historic-bridge-restoration",
        title: "Reviving the Century Bridge",
        client: "Department of Transportation",
        category: "Restoration",
        challenge: "Restore a 100-year-old suspension bridge holding 50,000 daily commuters without shutting down daytime traffic.",
        impactHighlight: "Delivered 2 Months Early",
        coverImage: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "cs-3",
        slug: "downtown-metro-hub",
        title: "Central Metro Hub Expansion",
        client: "City Transit Authority",
        category: "Infrastructure",
        challenge: "Excavate and expand an underground transit hub while maintaining structural integrity of the historic buildings above.",
        impactHighlight: "150k Daily Commuters Accommodated",
        coverImage: "https://images.unsplash.com/photo-1544983390-50d4eb0ec1d4?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "cs-4",
        slug: "tech-campus-innovation",
        title: "Next-Gen Tech Campus Headquarters",
        client: "InnovateTech Inc.",
        category: "Commercial",
        challenge: "Fast-track a 500,000 sq ft corporate campus prioritizing collaborative spaces and advanced biometric security integrations.",
        impactHighlight: "Zero Safety Incidents Over 2M Hours",
        coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },
];