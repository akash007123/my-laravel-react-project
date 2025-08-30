import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Show',
        href: '/users',
    },
];

type ShowUser = { id: number | string; name: string; email: string };

export default function Show({ user }: { user: ShowUser }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Show" />
            <div className="p-4">
                <Link
                    href={route('users.index')}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white font-semibold  px-3 py-1 rounded">
                    Back
                </Link>

                <div className="mt-3">
                    <div className="bg-white shadow-md rounded-md p-4">
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Name:</span> {user.name}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                </div>




            </div>

        </AppLayout>
    );
}
