export interface ServiceDetail {
    id: string;
    title: string;
    description: string;
    features: string[];
    images: string[]; // Changed from 'image' to 'images' array
}

export const SERVICES_LIST: ServiceDetail[] = [
    {
        id: "commercial",
        title: "Commercial Development",
        description: "We construct state-of-the-art commercial spaces designed to foster productivity and impress clients. From corporate headquarters to retail complexes, our builds are delivered on time, within budget, and to the highest industry standards.",
        features: [
            "High-rise office buildings",
            "Retail and shopping centers",
            "Corporate campuses",
            "LEED-certified green buildings"
        ],
        images: [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
        ],
    },
    {
        id: "infrastructure",
        title: "Heavy Civil Infrastructure",
        description: "Our heavy civil division tackles complex logistical and structural challenges. We build the arteries of modern society, ensuring critical infrastructure is robust, resilient, and ready for future generations.",
        features: [
            "Highway and bridge construction",
            "Mass transit rail systems",
            "Water treatment facilities",
            "Airport expansions"
        ],
        images: [
            "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop"
        ],
    },
    {
        id: "residential",
        title: "Large-Scale Residential",
        description: "Creating vibrant, sustainable communities. We manage large-scale residential developments from the ground up, prioritizing safe, beautiful, and lasting environments for families to thrive.",
        features: [
            "Multi-family high-rises",
            "Master-planned communities",
            "Luxury condominium complexes",
            "Affordable housing initiatives"
        ],
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200&auto=format&fit=crop"
        ],
    },
    {
        id: "restoration",
        title: "Architectural Restoration",
        description: "Preserving history while upgrading for the modern era. Our specialized restoration teams meticulously revive heritage buildings, integrating modern safety and efficiency standards without compromising historic integrity.",
        features: [
            "Historic landmark preservation",
            "Structural retrofitting",
            "Facade restoration",
            "Modern system integrations (MEP)"
        ],
        images: [
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1200&auto=format&fit=crop"
        ],
    },
];