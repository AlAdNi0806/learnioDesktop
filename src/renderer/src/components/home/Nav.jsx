"use client"

// import Link from "next/link"
import { Outlet, Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

// interface NavProps {
//   isCollapsed: boolean
//   links: {
//     title: string
//     label?: string
//     icon: LucideIcon
//     variant: "default" | "ghost"
//   }[]
// }

export function Nav({ links, isCollapsed }) {
    const location = useLocation();
 const [currentPath, setCurrentPath] = useState(location.pathname);

 useEffect(() => {
    // Update the currentPath state whenever the location changes
    setCurrentPath(location.pathname);
 }, [location]); // Pass location as a dependency to useEffect

    return (
        <TooltipProvider>
            <div
                data-collapsed={isCollapsed}
                className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
            >
                <nav className="grid gap-3 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                    {links.map((link, index) =>
                        isCollapsed ? (
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        to={link.path}
                                        className={cn(
                                            buttonVariants({ variant: currentPath.startsWith(link.path) ? "defaultMain" : "ghostMain", size: "md" }),
                                            "h-9 w-9",
                                        )}
                                    >
                                        <link.icon className="h-4 w-4" />
                                        <span className="sr-only">{link.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4">
                                    {link.title}
                                    {link.label && (
                                        <span className="ml-auto text-muted-foreground">
                                            {link.label}
                                        </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Link
                                key={index}
                                to={link.path}
                                className={cn(
                                    buttonVariants({ variant: currentPath.startsWith(link.path) ? "defaultMain" : "ghostMain", size: "sm" }),
                                    "justify-start gap-2"
                                )}
                            >
                                <link.icon className=" h-4 w-4" />
                                {link.title}
                                {link.label && (
                                    <span
                                        className={cn(
                                            "ml-auto",
                                            link.variant === "default" &&
                                            "text-background dark:text-white"
                                        )}
                                    >
                                        {link.label}
                                    </span>
                                )}
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </TooltipProvider>
    )
}
