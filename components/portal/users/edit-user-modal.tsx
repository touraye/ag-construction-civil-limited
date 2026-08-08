'use client'

import { useState } from 'react'
import { updateUser } from '@/app/(portal)/portal/actions/users'
import type { Profile } from '@/types'

interface Props {
    user: Profile
    isOpen: boolean
    onClose: () => void
    onUserUpdated: () => void
}

export default function EditUserModal({ user, isOpen, onClose, onUserUpdated }: Props) {
    const [ formData, setFormData ] = useState({
        full_name: user.full_name || '',
        role: user.role,
    })
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await updateUser({
                id: user.id,
                full_name: formData.full_name,
                role: formData.role,
            })
            onUserUpdated()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-brand-charcoal rounded-sm p-8 w-full max-w-md">
                <h2 className="font-display text-2xl text-brand-white mb-6">Edit User</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 bg-brand-dark border border-white/10 rounded-sm text-brand-mid cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-4 py-2 bg-brand-dark border border-white/10 rounded-sm text-brand-white focus:border-brand-blue focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-cond text-brand-light mb-2 uppercase tracking-wide">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full px-4 py-2 bg-brand-dark border border-white/10 rounded-sm text-brand-white focus:border-brand-blue focus:outline-none transition"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="project_manager">Project Manager</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-white/10 text-brand-light rounded-sm hover:border-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-brand-blue text-white rounded-sm hover:bg-blue-light transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}