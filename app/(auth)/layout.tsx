export const metadata = {
    title: 'AG Construction & Civil Concept Auth Page',
    description: 'Authentication page for AG Construction & Civil Concept',
}

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {       

    return (
        <div className="flex h-screen bg-brand-dark">            
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}