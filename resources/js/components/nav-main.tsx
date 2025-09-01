import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    // Debug: Log the items being processed
    console.log('NavMain items:', items);
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // Try using window.location.pathname instead of page.url for better URL matching
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname : page.url;
                    const isActive = currentPath === item.url || currentPath.startsWith(item.url + '/');
                    
                    // Debug: Log each item being rendered
                    console.log(`Rendering item: ${item.title}, URL: ${item.url}, isActive: ${isActive}`);
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
