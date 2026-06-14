import { Project } from "@/types";

export const FEATURED_PROJECTS: Project[] = [
    {
        id: "p-1",
        name: "Riyadh Metro",
        slug: "riyadh-metro",
        type: "infrastructure",
        description: "The largest metro project to be built in a single phase — with all six lines designed, constructed, and integrated simultaneously.",
        location: "SAUDI ARABIA",
        started_date: "2014-04-01",
        status: "in-progress",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1544983390-50d4eb0ec1d4?q=80&w=800&auto=format&fit=crop", // Placeholder Metro/Train
        gallery: [],
        partners: [],
        timeline: [],
    },
    {
        id: "p-2",
        name: "Vogtle Units 3 and 4",
        slug: "vogtle-units-3-and-4",
        type: "institutional",
        description: "The first new nuclear units built in the United States in the last three decades, providing clean, reliable energy.",
        location: "GEORGIA, U.S.",
        started_date: "2013-03-01",
        status: "in-progress",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1563604996456-1fb9c7f66a2e?q=80&w=800&auto=format&fit=crop", // Placeholder Industrial
        gallery: [],
        partners: [],
        timeline: [],
    },
    {
        id: "p-3",
        name: "Western Sydney International Airport",
        slug: "western-sydney-airport",
        type: "infrastructure",
        description: "A transformative infrastructure project designed to support the growing aviation needs of the Sydney region.",
        location: "AUSTRALIA",
        started_date: "2018-09-24",
        status: "in-progress",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=800&auto=format&fit=crop", // Placeholder Construction Crane
        gallery: [],
        partners: [],
        timeline: [],
    },
    {
        id: "p-4",
        name: "Pennsylvania Chemical Plant",
        slug: "pa-chemical-plant",
        type: "industrial",
        description: "A world-scale petrochemical facility setting new standards for efficiency and environmental compliance.",
        location: "PENNSYLVANIA, U.S.",
        started_date: "2017-11-01",
        status: "completed",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop", // Placeholder Factory at dusk
        gallery: [],
        partners: [],
        timeline: [],
    },
    // Add 5 more placeholder projects to reach the "9" total shown in your screenshot
    ...Array.from({ length: 5 }).map((_, i) => ({
        id: `p-${i + 5}`,
        name: `Global Project ${i + 5}`,
        slug: `global-project-${i + 5}`,
        type: "commercial" as const,
        description: "A hallmark of modern engineering and sustainable construction practices.",
        location: "VARIOUS LOCATIONS",
        started_date: "2020-01-01",
        status: "completed" as const,
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
        gallery: [],
        partners: [],
        timeline: [],
    })),
];


export const ALL_PROJECTS: Project[] = [
    {
        id: "p-1",
        name: "Riyadh Metro Line 3",
        slug: "riyadh-metro-line-3",
        type: "infrastructure",
        description: "The longest line of the massive Riyadh Metro project.",
        location: "Saudi Arabia",
        started_date: "2014-04-01",
        status: "in-progress",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1544983390-50d4eb0ec1d4?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-2",
        name: "Vogtle Units 3 & 4",
        slug: "vogtle-units-3-and-4",
        type: "industrial",
        description: "Advanced nuclear facility providing clean energy.",
        location: "Georgia, U.S.",
        started_date: "2013-03-01",
        status: "completed",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1563604996456-1fb9c7f66a2e?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-3",
        name: "Western Sydney Airport",
        slug: "western-sydney-airport",
        type: "infrastructure",
        description: "Transformative aviation infrastructure project.",
        location: "Australia",
        started_date: "2018-09-24",
        status: "in-progress",
        featured: true,
        cover_img: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-4",
        name: "Hudson Yards Tower",
        slug: "hudson-yards-tower",
        type: "commercial",
        description: "LEED Gold certified commercial skyscraper.",
        location: "New York, U.S.",
        started_date: "2019-01-15",
        status: "completed",
        featured: false,
        cover_img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-5",
        name: "Oasis Residential Complex",
        slug: "oasis-residential",
        type: "residential",
        description: "Luxury high-rise residential complex with green spaces.",
        location: "Dubai, UAE",
        started_date: "2021-06-10",
        status: "in-progress",
        featured: false,
        cover_img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-6",
        name: "City Central Mall",
        slug: "city-central-mall",
        type: "commercial",
        description: "Massive retail and entertainment complex.",
        location: "London, UK",
        started_date: "2022-02-01",
        status: "in-progress",
        featured: false,
        cover_img: "https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-7",
        name: "National Heritage Museum",
        slug: "national-heritage-museum",
        type: "institutional",
        description: "State-of-the-art national archive and museum.",
        location: "Berlin, Germany",
        started_date: "2023-05-20",
        status: "not-started",
        featured: false,
        cover_img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
    {
        id: "p-8",
        name: "Harbor Mixed-Use Development",
        slug: "harbor-mixed-use",
        type: "mixed-use",
        description: "Integrating retail, residential, and office spaces.",
        location: "Sydney, Australia",
        started_date: "2020-11-11",
        status: "completed",
        featured: false,
        cover_img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop",
        gallery: [], partners: [], timeline: [],
    },
];



export const DUMMY_PROJECT: Project = {
    id: "p-aurora",
    name: "Aurora Eco-Tower",
    slug: "aurora-eco-tower",
    type: "commercial",
    description: "The Aurora Eco-Tower represents the pinnacle of modern sustainable commercial architecture. Spanning 45 stories, it integrates a smart-glass facade, self-sustaining rainwater harvesting, and state-of-the-art structural engineering to achieve LEED Platinum certification. This project sets a new benchmark for corporate headquarters in dense urban environments.",
    location: "London, UK",
    started_date: "2024-03-15",
    status: "in-progress",
    featured: true,
    cover_img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
    gallery: [
        "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop"
    ],
    client: "Global Horizon Developments",
    area_sqm: 125000,
    value_usd: 450000000,
    tags: [ "high-rise", "LEED-platinum", "smart-building", "commercial" ],
    timeline: [
        {
            phase: "Design & Feasibility",
            startDate: "2023-01-10",
            endDate: "2023-08-30",
            status: "completed",
            description: "Completed comprehensive environmental impact studies, zoning approvals, and final architectural blueprints."
        },
        {
            phase: "Foundation & Excavation",
            startDate: "2024-03-15",
            endDate: "2024-11-20",
            status: "completed",
            description: "Deep foundation piling and subterranean parking levels established."
        },
        {
            phase: "Structural Framing",
            startDate: "2024-12-01",
            endDate: "2026-02-15",
            status: "in-progress",
            description: "Currently erecting the primary steel framework. Floors 1 through 25 are complete."
        },
        {
            phase: "Facade & MEP Integration",
            startDate: "2025-06-01",
            endDate: "2026-10-01",
            status: "pending",
            description: "Installation of the smart-glass exterior and mechanical, electrical, and plumbing systems."
        },
        {
            phase: "Final Handover",
            startDate: "2027-01-15",
            endDate: "2027-02-28",
            status: "pending",
            description: "Final safety inspections, interior finishings, and official client handover."
        }
    ],
    partners: [
        {
            name: "Apex Architecture Group",
            role: "Lead Architect",
            contact_info: "contact@apexarch.com",
            website: "https://example.com",
            socials: [
                { name: "linkedin", logo: "linkedin" },
                { name: "instagram", logo: "instagram" }
            ]
        },
        {
            name: "SteelCore Engineering",
            role: "Structural Engineer",
            contact_info: "+44 20 7946 0958",
            website: "https://example.com",
        },
        {
            name: "GreenFlow Solutions",
            role: "MEP & Sustainability Consultant",
            socials: [
                { name: "twitter", logo: "twitter" }
            ]
        }
    ]
};