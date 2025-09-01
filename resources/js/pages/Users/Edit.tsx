import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Edit',
        href: '/users',
    },
];

type EditUser = { id: number | string; name: string; email: string };

export default function Edit({ user }: { user: EditUser }) {
    const { data, setData, errors, put } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Edit" />

            <motion.div
                className="p-6 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Back Button */}
                <Link
                    href={route('users.index')}
                    className="mb-6 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
                >
                    Back
                </Link>

                {/* Form Card */}
                <motion.div
                    className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Edit User
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Name Field */}
                        <div className="grid gap-1">
                            <label className="text-sm font-medium text-gray-700 select-none">
                                Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                name="name"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                placeholder="Enter Your Name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="grid gap-1">
                            <label className="text-sm font-medium text-gray-700 select-none">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                name="email"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                placeholder="Enter Your Email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-1">
                            <label className="text-sm font-medium text-gray-700 select-none">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                name="password"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                placeholder="Enter New Password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.03 }}
                        >
                            Update User
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}
