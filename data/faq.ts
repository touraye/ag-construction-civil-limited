export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export const FAQS_DATA: FAQ[] = [
    {
        id: "faq-1",
        question: "What services does your company provide?",
        answer: "We provide a comprehensive range of construction and infrastructure services including residential builds, commercial developments, heavy civil engineering, and specialized architectural restorations.",
    },
    {
        id: "faq-2",
        question: "Are there any hidden costs?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua eiusmod tempor incididunt ut labore...",
    },
    {
        id: "faq-3",
        question: "How is the project cost determined?",
        answer: "Project costs are determined through a rigorous estimating process that accounts for materials, labor, specialized equipment requirements, timeline, and site conditions. We provide a detailed breakdown before any contract is signed.",
    },
    {
        id: "faq-4",
        question: "How can I track the progress of my project?",
        answer: "You will be assigned a dedicated project manager and given access to our secure client portal, where you can view daily logs, progress photos, timeline updates, and direct communications with the team.",
    },
    {
        id: "faq-5",
        question: "Do you provide free consultations or quotes?",
        answer: "Yes, we offer complimentary initial consultations and high-level estimates to help you understand the feasibility and rough costs of your vision before committing to detailed architectural and engineering planning.",
    },
    {
        id: "faq-6",
        question: "What types of projects do you specialize in?",
        answer: "We specialize in complex structural environments, including high-rise commercial buildings, large-scale residential communities, and advanced industrial facilities requiring precision engineering.",
    },
];