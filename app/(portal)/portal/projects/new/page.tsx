import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProjectForm from '@/components/portal/projects/project-form'

export default function NewProjectPage() {
    return (
        <div className="p-4 md:p-8 max-w-4xl">
            <Link href="/portal/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0056e0] transition-colors mb-6">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Projects
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">New Project</h1>
            <ProjectForm mode="create" />
        </div>
    )
}