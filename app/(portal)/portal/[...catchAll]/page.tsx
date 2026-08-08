import { notFound } from "next/navigation";

export default function PortalCatchAll() {
    // This instantly triggers the app/(portal)/portal/not-found.tsx file we just built!
    notFound();
}