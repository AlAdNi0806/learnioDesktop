import React, { useState } from 'react'
import { Nav } from './Nav'

import {
    Inbox,
    ChevronRight,
    User,
    Pickaxe,
    Book,
    ServerCog
} from "lucide-react"
import { Button } from '@/components/ui/button'

const SideNavbar = () => {
    const [isCollapsed, setisCollapsed] = useState(false)

    function toggleSidebar() {
        setisCollapsed(!isCollapsed)
    }

    return (
        <div className='h-full relative pb-10 pt-24 backdrop-blur-lg bg-indigo-900 bg-opacity-40 border-r-2 border-violet-800'>
            <div className='absolute right-[-20px] top-7'>
                <Button onClick={toggleSidebar} variant='secondaryMain' className='rounded-full p-2'>
                    <ChevronRight />
                </Button>
            </div>
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    {
                        title: "Welcome",
                        path: "/welcome", // This should match the path of your Welcome route
                        icon: Inbox,
                        variant: "defaultMain",
                    },
                    {
                        title: "AI Module",
                        path: "/aiModules", // This should match the path of your AiModule route
                        icon: Inbox,
                        variant: "ghostMain",
                    },
                    {
                        title: "AI Learn",
                        path: "/userEnrolledAiModules",
                        icon: Inbox,
                        variant: "ghostMain"
                    },
                    {
                        title: "Profile",
                        path: "/profile", // This should match the path of your Profile route
                        icon: User,
                        variant: "ghostMain",
                    },
                    {
                        title: "Craft",
                        path: "/craftModules",
                        icon: Pickaxe,
                        variant: "ghostMain"
                    },
                    {
                        title: "Modules",
                        path: "/modules",
                        icon: Book,
                        variant: "ghostMain"
                    },
                    {
                        title: "Control",
                        path: "/Control",
                        icon: ServerCog,
                        variant: "ghostMain"
                    }
                ]}
            />
        </div>
    )
}

export default SideNavbar