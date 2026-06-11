export interface ProcessStep {
    id: string;
    stepNumber: string;
    title: string;
    description: string;
    image: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
    {
        id: "consultation",
        stepNumber: "01",
        title: "Consultation & Planning",
        description: "Every great structure begins with a conversation. We work closely with stakeholders to understand the vision, assess feasibility, handle zoning permits, and create a rigorous, transparent blueprint for success.",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop", // Architects looking at plans
    },
    {
        id: "construction",
        stepNumber: "02",
        title: "Design & Construction",
        description: "Our certified engineers and builders bring the blueprint to life. We utilize cutting-edge technology and uncompromising safety standards to ensure the build remains on schedule and strictly within budget.",
        image: "https://images.unsplash.com/photo-1541888087405-1886cc86d526?q=80&w=1200&auto=format&fit=crop", // Active construction site
    },
    {
        id: "handover",
        stepNumber: "03",
        title: "Final Inspection & Handover",
        description: "Before handing over the keys, we conduct exhaustive structural, mechanical, and aesthetic inspections. We ensure every square inch meets our world-class standards and your absolute satisfaction.",
        image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1200&auto=format&fit=crop", // Handshake / Modern building
    },
];