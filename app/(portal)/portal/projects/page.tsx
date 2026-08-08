import { Suspense } from "react";
import Link from 'next/link';
import { Plus } from "lucide-react";
import { getAllProjects } from '@/app/(portal)/portal/actions/projects';
import ProjectsTable from '@/components/portal/projects/projects-table';
import { ProjectsTableSkeleton } from "@/components/portal/projects/projects-skeleton";
import { Button } from "@/components/ui/button";


async function ProjectsData() {
    const result = await getAllProjects();    

    return (
        <div className="p-4 md:p-8">
            {result.success && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Projects</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {result.data.length} project{result.data.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                   <Button asChild className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                        <Link href="/portal/projects/new">
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Link>
                    </Button>
                </div>
            )}
            <ProjectsTable result={result} />
        </div>
    );
}

export default function ProjectsListPage() {
    return (
        <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsData />
        </Suspense>
    );
}