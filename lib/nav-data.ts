interface NavItem {
    title: string;
    href: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}


export const NAV_DATA: NavGroup[] = [
    {
        title: "Our Company",
        items: [
            { title: "About Us", href: "/about-us" },
            { title: "Our Leadership", href: "/our-leadership" },
            { title: "Careers", href: "/careers" },
        ],
    },
    {
        title: "What We Do",
        items: [
            { title: "Services", href: "/services" },
            { title: "Projects", href: "/projects" },
        ],
    },
    {
        title: "Insights",
        items: [
            { title: "Blogs", href: "/blogs" },
            { title: "Case Studies", href: "/case-studies" },
        ],
    },
];