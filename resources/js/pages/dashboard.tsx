import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardUser = { name: string; email: string };

export default function Dashboard({ user }: { user: DashboardUser }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name}  !</h2>
                    {/* <div className="space-y-2">
                        <p className="text-gray-600">
                            <span className="font-medium">Name:</span> {user.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {user.email}
                        </p>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
