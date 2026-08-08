'use client'

import { useState } from 'react'
import { SERVICE_ICONS } from '@/lib/constants/service-icons'
import DynamicIcon from '@/components/shared/portal/dynamic-icon'

interface Props {
    value: string
    onChange: (icon: string) => void
}

export default function IconPicker({ value, onChange }: Props) {
    const [ open, setOpen ] = useState(false)

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="input flex items-center gap-3"
            >
                <DynamicIcon name={value || 'help-circle'} size={18} className="text-brand-blue" />
                <span className="text-brand-light text-sm">{value || 'Select icon...'}</span>
            </button>

            {open && (
                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-brand-charcoal border border-white/10 rounded-sm p-2 grid grid-cols-5 gap-1">
                    {SERVICE_ICONS.map(iconName => (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                                onChange(iconName)
                                setOpen(false)
                            }}
                            title={iconName}
                            className={`flex items-center justify-center p-3 rounded-sm transition ${value === iconName
                                    ? 'bg-brand-blue text-white'
                                    : 'text-brand-light hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <DynamicIcon name={iconName} size={18} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}