export interface Milestone {
    id: number;
    year: string;
    title: string;
    description: string;
    image: string;
}

export const MILESTONES_DATA: Milestone[] = [
    {
        id: 1,
        year: "2000",
        title: "The Beginning",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop", // Construction architects meeting
    },
    {
        id: 2,
        year: "2005",
        title: "First Major Success",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=800&auto=format&fit=crop", // Builder smiling on site
    },
    {
        id: 3,
        year: "2015",
        title: "Expanding Horizons",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop", // Skyscrapers under construction
    },
    {
        id: 4,
        year: "2020",
        title: "Industry Recognition",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", // Diverse team posing
    },
];