import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type UserRow = { id: number | string; name: string; email: string };
type AuthUser = { name: string; email: string };

export default function Index({ users, user }: { users: UserRow[]; user: AuthUser }) {
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);

    function handleDelete(id: any) {
        setDeleteId(id);
        setShowModal(true);
    }

    function confirmDelete() {
        if (deleteId !== null) {
            router.delete(route('users.destroy', deleteId));
            setShowModal(false);
            setDeleteId(null);
        }
    }

    function cancelDelete() {
        setShowModal(false);
        setDeleteId(null);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Users" />

            <motion.div
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Header + Create Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">👥 Manage Users</h1>
                    <Link
                        href={route('users.create')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Create
                    </Link>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto shadow-lg rounded-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold">ID</th>
                                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                                <th className="px-6 py-3 text-sm font-semibold">Email</th>
                                <th className="px-6 py-3 text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(({ id, name, email }: UserRow, idx) => (
                                <motion.tr
                                    key={id}
                                    className={`${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } hover:bg-blue-50 transition`}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <td className="px-6 py-4 border-b">{id}</td>
                                    <td className="px-6 py-4 border-b font-medium text-gray-800">{name}</td>
                                    <td className="px-6 py-4 border-b text-gray-600">{email}</td>
                                    <td className="px-6 py-4 border-b flex gap-2">
                                        <Link
                                            href={route('users.edit', id)}
                                            className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg shadow transition-transform transform hover:scale-110"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route('users.show', id)}
                                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow transition-transform transform hover:scale-110"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow transition-transform transform hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">⚠️ Confirm Delete</h3>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete this user?</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={cancelDelete}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AppLayout>
    );
}
