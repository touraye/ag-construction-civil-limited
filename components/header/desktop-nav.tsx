"use client";

import * as React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NAV_DATA } from "@/lib/nav-data";


export function DesktopNav({ scrolled }: { scrolled: boolean }) {
    return (
        <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
                {NAV_DATA.map((section) => (
                    <NavigationMenuItem key={section.title}>
                        <NavigationMenuTrigger className={cn("bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-sm font-medium transition-colors",  !scrolled && "text-white dark:text-white hover:text-black dark:hover:text-black")}>
                            {section.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-2 p-4 md:w-[250px]">
                                {section.items.map((item) => (
                                    <li key={item.title}>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={item.href}
                                                className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800")}
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    {item.title}
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}