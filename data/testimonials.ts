export interface Testimonial {
    id: string;
    rating: number;
    title: string;
    content: string;
    authorName: string;
    authorRole: string;
    authorAvatar: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
    {
        id: "t1",
        rating: 5.0,
        title: "Beyond Expectations!",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        authorName: "Leslie Alexander",
        authorRole: "Happy Client",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
        id: "t2",
        rating: 5.0,
        title: "Top-Notch Service!",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        authorName: "Jenny Wilson",
        authorRole: "Happy Client",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    },
    {
        id: "t3",
        rating: 5.0,
        title: "Unmatched Quality",
        content: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate.",
        authorName: "Robert Fox",
        authorRole: "Project Manager",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    },
    {
        id: "t4",
        rating: 5.0,
        title: "Highly Recommend!",
        content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.",
        authorName: "Kristin Watson",
        authorRole: "Home Owner",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
];