import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, BriefcaseBusiness, CalendarCheck, CalendarDays, Images, Slack, UserPen, LayoutTemplate, BadgeIndianRupee, FileUser, Link2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        url: '/users',
        icon: Users,
    },
    {
        title: 'Projects',
        url: '/projects',
        icon: BriefcaseBusiness,
    },
    {
        title: 'Events',
        url: '/events',
        icon: CalendarCheck,
    },
    {
        title: 'Holidays',
        url: '/holidays',
        icon: CalendarDays,
    },
    {
        title: 'Gallery',
        url: '/gallery',
        icon: Images,
    },
    {
        title: 'Department',
        url: '/department',
        icon: Slack,
    },
    {
        title: 'Report',
        url: '/reports',
        icon: UserPen,
    }, 
    {
        title: 'Layout',
        url: '/layout',
        icon: LayoutTemplate,
    },
    {
        title: 'Leads',
        url: '/leads',
        icon: BadgeIndianRupee,
    },
    {
        title: 'Applicant',
        url: '/applicants',
        icon: FileUser
    },
    {
        title: 'Links',
        url: '/links',
        icon: Link2
    }
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         url: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         url: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar({ user }: { user?: { name: string; email: string } }) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo user={user} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
