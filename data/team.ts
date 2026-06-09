export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    socials: {
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}

export const TEAM_DATA: TeamMember[] = [
    {
        id: "team-1",
        name: "Omar Jallow",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", // Professional man in suit
        bio: "With over 25 years of global construction experience, Omar leads Conztru with a vision for sustainable and innovative structural engineering.",
        socials: { linkedin: "#", twitter: "#", email: "#" },
    },
    {
        id: "team-2",
        name: "Binta Diallo",
        role: "Chief Operating Officer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", // Professional woman
        bio: "Binta oversees daily operations across all global projects, ensuring rigorous safety standards and on-time delivery without compromising quality.",
        socials: { linkedin: "#", email: "#" },
    },
    {
        id: "team-3",
        name: "Nuha Badjie",
        role: "Head of Architecture",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", // Professional man smiling
        bio: "An award-winning architect, Nuha pioneers our sustainable design initiatives, blending modern aesthetics with functional infrastructure.",
        socials: { linkedin: "#", twitter: "#" },
    },
    {
        id: "team-4",
        name: "Mariama Sanyang",
        role: "VP of Engineering",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", // Professional woman portrait
        bio: "Mariama leads our structural engineering division, tackling complex challenges in high-rise and heavy civil construction environments.",
        socials: { linkedin: "#", email: "#" },
    },
];