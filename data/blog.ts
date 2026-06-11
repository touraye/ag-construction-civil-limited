export type BlogCategory = "Industry News" | "Company Updates" | "Innovation" | "Safety";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: BlogCategory;
    author: string;
    date: string;
    readTime: string;
    coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "post-1",
        slug: "future-of-sustainable-construction",
        title: "The Future of Sustainable Construction: Materials to Watch",
        excerpt: "Explore the cutting-edge eco-friendly materials that are revolutionizing the way we build high-rise commercial structures.",
        category: "Innovation",
        author: "Michael Chen",
        date: "October 12, 2025",
        readTime: "5 min read",
        coverImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop", // Green architecture
    },
    {
        id: "post-2",
        slug: "navigating-supply-chain-challenges",
        title: "Navigating Global Supply Chain Challenges in 2026",
        excerpt: "How top construction firms are mitigating risks and ensuring on-time delivery despite international material shortages.",
        category: "Industry News",
        author: "James Anderson",
        date: "September 28, 2025",
        readTime: "7 min read",
        coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop", // Shipping containers/cranes
    },
    {
        id: "post-3",
        slug: "ai-in-structural-engineering",
        title: "How AI is Reshaping Structural Engineering",
        excerpt: "From predictive maintenance to automated blueprint generation, artificial intelligence is the new frontier for builders.",
        category: "Innovation",
        author: "Elena Rodriguez",
        date: "September 15, 2025",
        readTime: "6 min read",
        coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", // Tech/Engineering
    },
    {
        id: "post-4",
        slug: "q3-company-milestones",
        title: "Conztru Secures Contract for Central Metro Expansion",
        excerpt: "We are proud to announce our selection as the lead contractor for the city's multi-billion dollar transit expansion project.",
        category: "Company Updates",
        author: "Sarah Jenkins",
        date: "August 30, 2025",
        readTime: "3 min read",
        coverImage: "https://images.unsplash.com/photo-1544983390-50d4eb0ec1d4?q=80&w=800&auto=format&fit=crop", // Metro/Train
    },
    {
        id: "post-5",
        slug: "zero-incident-workplace",
        title: "Achieving a Zero-Incident Workplace: Our Methodology",
        excerpt: "Safety isn't just a compliance metric; it's a culture. Discover the rigorous protocols that keep our teams safe every day.",
        category: "Safety",
        author: "David Miller",
        date: "August 14, 2025",
        readTime: "8 min read",
        coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop", // Hardhats
    },
    {
        id: "post-6",
        slug: "adaptive-reuse-architecture",
        title: "Adaptive Reuse: Breathing New Life into Historic Structures",
        excerpt: "Why tearing down isn't always the answer. A deep dive into the engineering challenges of architectural restoration.",
        category: "Industry News",
        author: "Michael Chen",
        date: "July 22, 2025",
        readTime: "6 min read",
        coverImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop", // Restoration/Bricks
    },
];