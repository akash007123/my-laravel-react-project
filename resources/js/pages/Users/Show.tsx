import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

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

            <motion.div
                className="p-6 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Back Button */}
                <Link
                    href={route('users.index')}
                    className="mb-6 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    Back
                </Link>

                {/* User Info Card */}
                <motion.div
                    className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                        User Details
                    </h2>

                    <div className="space-y-4 text-gray-700 text-lg">
                        <p>
                            <span className="font-semibold">Name:</span> {user.name}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}
