'use client';

import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Calendar,
    Home,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Inbox,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Search,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Settings,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Key,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Menu items.
const items = [
    {
        title: 'Overview',
        url: '/admin/dashboard',
        icon: Home,
    },
    {
        title: 'Products',
        url: '/admin/dashboard/products',
        icon: Package,
    },
    {
        title: 'Orders',
        url: '/admin/dashboard/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Users',
        url: '/admin/dashboard/users',
        icon: Users,
    },
    {
        title: 'Combo Packs',
        url: '/admin/dashboard/combo-packs',
        icon: FileText,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="bg-[#283618] text-white border-r-0">
            <SidebarHeader className="bg-[#283618] text-white p-0 border-b border-white/10">
                <div className="flex items-center gap-3 px-6 h-16">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#606C38] text-white">
                        <Package className="size-5" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-bold text-base tracking-wide">EcoForever</span>

                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#283618] p-0 gap-0">
                <SidebarMenu className="gap-0">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
                                className="w-full rounded-none h-14 px-6 border-b border-white/10 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors data-[active=true]:bg-[#606C38] data-[active=true]:text-white data-Content[active=true]:hover:bg-[#606C38]"
                            >
                                <Link href={item.url} className="flex items-center gap-3 text-base font-normal">
                                    <item.icon className="h-5 w-5 opacity-70 group-data-[active=true]:opacity-100" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="bg-[#283618] p-0">
                <SidebarMenu className="gap-0">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="w-full rounded-none h-14 px-6 border-t border-white/10 hover:bg-white/5 hover:text-white transition-colors text-white"
                        >
                            <Link href="/admin/dashboard/change-password" className="flex items-center gap-3 text-base font-normal">
                                <Key className="h-5 w-5 opacity-70" />
                                <span>Change Password</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
