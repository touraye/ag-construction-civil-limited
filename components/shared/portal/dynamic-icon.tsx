'use client'

import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface Props extends LucideProps {
    name: string
}

export default function DynamicIcon({ name, ...props }: Props) {
    // Convert 'building-2' -> 'Building2', 'door-open' -> 'DoorOpen'
    const pascalCase = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[ pascalCase ]

    if (!IconComponent) {
        return <Icons.HelpCircle {...props} />
    }

    return <IconComponent {...props} />
}