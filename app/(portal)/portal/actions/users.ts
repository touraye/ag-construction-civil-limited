'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ActionResult } from '@/types/actions'
import { User } from '@supabase/supabase-js'
import { checkUSer } from '@/lib/auth/role-check'

export type CreateUserInput = {
    email: string
    password: string
    full_name: string
    role: 'super_admin' | 'project_manager' | 'editor' | 'viewer'
}

export type UpdateUserInput = {
    id: string
    full_name?: string
    role?: string
    is_active?: boolean
}



// ─── GET ALL USERS ──────────────────────────────────
export async function getAllUsers(): Promise<ActionResult<User[]>> {
    try {

        const supabase = await createClient()
    
        const { data: { user }, error: userError } = await supabase.auth.getUser()
    
        if (!user) {
            return {success: false, error: "Unauthorize"}
        }
    
        // Simple check: is the user a super admin based on their JWT?
        const role = user.user_metadata?.role        
    
        if (role !== 'super_admin') {            
            return { success: false, error: 'You do not have access to users' }
        }
    
        // If we get here, RLS will also allow the query
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
    
        if (error) {            
            return { success: false, error: userError ? userError.message : error.message }
        }

        return users ? { success: true, data: users } : { success: false, error: 'No users found' }
    } catch (err) {        
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to load projects',
        }
    }
}

// ─── GET SINGLE USER ────────────────────────────────
export async function getUser(userId: string): Promise<ActionResult<User>> {  
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }
    

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    return { success: true, data: profile }    
}

// ─── CREATE USER ────────────────────────────────────
export async function createUser(input: CreateUserInput): Promise<ActionResult<User>> {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }    

    // Check if current user is super admin
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentProfile?.role !== 'super_admin') {        
        return { success: false, error: 'Only super admins can create users' }
    }

    // Create auth user (using admin client — bypasses RLS)
    const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
            full_name: input.full_name,
            role: input.role,
        },
    })

    if (authError) return {success: false, error: authError.message}

    // Profile is auto-created by trigger, but update it to ensure correct role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: input.full_name,
            role: input.role,
        })
        .eq('id', newAuthUser.user.id)
        .select()
        .single()

    if (profileError) throw profileError

    return {success: true, data: profile, message: 'User created successfully'}
}

// ─── UPDATE USER ────────────────────────────────────
export async function updateUser(input: UpdateUserInput): Promise<ActionResult<User>> {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false,  error: "Unauthorized"}

    // Check if current user is super admin
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentProfile?.role !== 'super_admin') {
        return {success: false, error:'Only super admins can update users'}
    }

    // Update profile
    const updateData: any = {}
    if (input.full_name !== undefined) updateData.full_name = input.full_name
    if (input.role !== undefined) updateData.role = input.role
    if (input.is_active !== undefined) updateData.is_active = input.is_active

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', input.id)
        .select()
        .single()

    if (profileError) throw profileError

    // If updating role, also update auth user metadata
    if (input.role) {
        await adminClient.auth.admin.updateUserById(input.id, {
            user_metadata: { role: input.role },
        })
    }

    return { success: true, data: profile, message: 'User updated successfully' }    
}

// ─── SUSPEND USER ───────────────────────────────────
export async function suspendUser(userId: string) {
    return updateUser({ id: userId, is_active: false })
}

// ─── REACTIVATE USER ────────────────────────────────
export async function reactivateUser(userId: string) {
    return updateUser({ id: userId, is_active: true })
}

// ─── DELETE USER ────────────────────────────────────
export async function deleteUser(userId: string): Promise<ActionResult> {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {success: false, error: "Unauthorize"}
    }   

    // Check if current user is super admin
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    

    if (currentProfile?.role !== 'super_admin') {
        return { success: false, error: "Only super admins can delete users"}
    }

    // Delete from auth (cascades to profiles via foreign key)
    const { error } = await adminClient.auth.admin.deleteUser(userId)
    if (error) return {success: false, error: "Failed to delete user"}

    return { success: true, data: undefined, message: "User deleted successfully"}
}