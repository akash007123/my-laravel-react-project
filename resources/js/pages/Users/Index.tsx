import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, Pencil } from 'lucide-react';
import {useState} from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type UserRow = { id: number | string; name: string; email: string };

export default function Index({users}: { users: UserRow[] }) {

    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);


    // function handleDelete(id: any){
    //     if(confirm("Are you sure to delete this user !"))
    //         router.delete(route('users.destroy', id))
    // }

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4">
                <Link href={route('users.create')}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white font-semibold  px-3 py-1 rounded"> Create</Link>
                <div className="overflow-x-auto mt-3">
                    <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold border-b">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold border-b">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold border-b">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {users.map(({id, name, email}: UserRow) => 
                            <tr key={id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b">{id}</td>
                                    <td className="px-6 py-4 border-b">{name}</td>
                                    <td className="px-6 py-4 border-b">{email}</td>
                                <td className="px-6 py-4 border-b flex flex-wrap gap-2">
                                    <Link href={route('users.edit', id)} className="cursor-pointer hover:bg-yellow-500 bg-blue-600  hover:text-white text-white font-semibold  px-3 py-2 rounded"><Pencil className="size-4" /></Link>
                                    <Link href={route('users.show', id)} className="cursor-pointer hover:bg-pink-500 bg-green-600 hover:text-white text-white font-semibold  px-3 py-1 rounded"><Eye className="size-4" /></Link>
                                    <button
                                    onClick={() => handleDelete(id)}
                                    className="cursor-pointer hover:bg-orange-600 bg-red-600 hover:text-white text-white font-semibold  px-3 py-1 rounded"><Trash2 className="size-4" /></button>
                                </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                     <div className="fixed inset-0 bg-gray-500/50 backdrop-filter backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this user?</p>
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={cancelDelete}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </AppLayout>
    );
}
