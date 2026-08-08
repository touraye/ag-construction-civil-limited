"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from 'sonner'
import type { Profile } from "@/types";
import { getAllUsers } from "@/app/(portal)/portal/actions/users";

import UsersList from "@/components/portal/users/users-list";
import { UsersTableSkeleton } from "@/components/portal/users/users-skeleton";


export default function UsersPage() {        
    const [ users, setUsers ] = useState<Profile[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);
   
    
    async function loadUsers() {       
        setLoading(true);        
        
        const result = await getAllUsers();

        if (!result.success) {            
            toast.error(result.error)
            setUsers([])
            setLoading(false)
            setError(true)
            return
        }

        setUsers(result.data)
        setLoading(false)
    }

    useEffect(() => {
        loadUsers();
    }, []);


    if (error) {
        return (
            <div className="py-16 text-center border border-white/10 rounded-sm">
                <p className="text-brand-light text-sm">
                    You don&apos;t have permission to manage users.
                </p>
                <p className="text-brand-mid text-xs mt-1">
                    Contact an administrator if you believe this is a mistake.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full">                      
            {/* Loading / Success States */}
            {loading ? (
                // Displays our premium shadcn skeleton table while waiting for Supabase
                <UsersTableSkeleton />
            ) : (                
                <UsersList users={users} onUsersChange={loadUsers} />
            )}
        </div>
    );
}