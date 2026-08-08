"use client";

import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "@/app/(portal)/portal/actions";

export function Header({ user_metadata }: { user_metadata: any }) {    


    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-6">

            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                    </SheetTrigger>
                    {/* We render the exact same Sidebar component inside the Sheet for mobile */}
                    <SheetContent side="left" className="p-0 w-72 border-r-0">
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                {/* Optional Page Title or Breadcrumbs could go here */}
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white hidden sm:block">
                    Portal Dashboard
                </h2>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                                <AvatarFallback className="bg-[#0056e0] text-white">AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                
                                
                                <p className="text-sm font-medium leading-none">{user_metadata?.full_name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user_metadata?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400" onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </header>
    );
}