import { SidebarProvider } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    // Force sidebar to be open by default to ensure all navigation items are visible
    const [isOpen, setIsOpen] = useState(true);

    // Clear any existing sidebar cookie to ensure the sidebar is expanded
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Clear the sidebar cookie to force expansion
            document.cookie = 'sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            localStorage.removeItem('sidebar');
        }
    }, []);

    const handleSidebarChange = (open: boolean) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', String(open));
        }
    };

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return (
        <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleSidebarChange}>
            {children}
        </SidebarProvider>
    );
}
