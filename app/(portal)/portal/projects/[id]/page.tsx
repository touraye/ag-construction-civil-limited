import { getProjectById } from '@/app/(portal)/portal/actions/projects'
import ProjectEditPageClient from '@/components/portal/projects/project-edit-page-client'
import { createClient } from '@/lib/supabase/server'
import { FinancePermission, ProjectPermission } from '@/types'

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {    
    const { id } = await params
    const supabase = await createClient()

    // Get current user role and their assignment for this project
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role
    const isSuperAdmin = role === 'super_admin'

    // For PMs, fetch their specific finance_permission for this project
    let financePermission: FinancePermission = null
    let projectPermission: ProjectPermission | null = null

    if (role === 'project_manager' && user) {
        const { data: assignment } = await supabase
            .from('project_assignments')
            .select('finance_permission, project_permission')
            .eq('project_id', id)
            .eq('user_id', user.id)
            .single()

        financePermission = (assignment?.finance_permission ?? null) as FinancePermission
        projectPermission = (assignment?.project_permission ?? 'view') as ProjectPermission
    }
    const result = await getProjectById(id)


    return (
        <div className="p-8 max-w-4xl">            
            <ProjectEditPageClient
                result={result}
                isSuperAdmin={isSuperAdmin}
                financePermission={financePermission}
                projectPermission={projectPermission}
            />
        </div>
    )
}