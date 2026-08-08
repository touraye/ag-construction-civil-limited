import { Suspense } from "react"
import ServicesPageClient from '@/components/portal/services/services-page-client'
import { getAllServices } from '../actions/services'
import { ServicesTableSkeleton } from "@/components/portal/services/services-skeleton"

// Extract the data fetching into a dedicated async component
async function ServicesData() {
  const result = await getAllServices()
  return <ServicesPageClient result={result} />
}

export default function ServicesPage() {
  return (
    // The Suspense boundary catches the async operation and shows the skeleton
    <Suspense fallback={<ServicesTableSkeleton />}>
      <ServicesData />
    </Suspense>
  )
}