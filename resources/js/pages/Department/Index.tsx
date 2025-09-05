import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X, Eye, Pencil, Trash2 } from 'lucide-react';

type AuthUser = { name: string; email: string };

interface Department {
    id?: number | string;
    department_head?: string;
    department_name: string;
}

interface DepartmentIndexProps {
    user: AuthUser;
    department?: Department[];
}


export default function DepartmentIndex({ user, department = [] }: DepartmentIndexProps) {
    console.log("Departments received:", department);

    const [open, setOpen] = useState(false);
    const [viewDept, setViewDept] = useState<Department | null>(null);
    const [editDept, setEditDept] = useState<Department | null>(null);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{ department_head: string; department_name: string }>({
        department_head: '',
        department_name: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('department.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    function openEdit(d: Department) {
        setEditDept(d);
        setData({ department_head: d.department_head || '', department_name: d.department_name });
    }

    function submitEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editDept?.id) return;
        router.put(route('department.update', editDept.id), data, {
            onSuccess: () => {
                setEditDept(null);
                reset();
            },
        } as any);
    }

    function confirmDelete() {
        if (!deleteId) return;
        router.delete(route('department.destroy', deleteId), {
            onSuccess: () => setDeleteId(null),
        });
    }

    return (
        <AppLayout user={user}>
            <Head title="Department" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Department</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {department.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No departments yet.</td>
                                    </tr>
                                ) : (
                                    department.map((d) => (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.department_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.department_head || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setViewDept(d)}
                                                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(d)}
                                                        className="cursor-pointer text-green-600 hover:text-green-800"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(d.id!)}
                                                        className="cursor-pointer text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Add Department</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Head *</label>
                                <input
                                    type="text"
                                    value={data.department_head}
                                    onChange={(e) => setData('department_head', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.department_head && <p className="text-red-500 text-sm mt-1">{errors.department_head}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                                <input
                                    type="text"
                                    value={data.department_name}
                                    onChange={(e) => setData('department_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.department_name && <p className="text-red-500 text-sm mt-1">{errors.department_name}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewDept && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setViewDept(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Department Details</h2>
                        <div className="space-y-2">
                            <div><span className="text-sm text-gray-500">Name:</span> <span className="text-sm text-gray-900">{viewDept.department_name}</span></div>
                            <div><span className="text-sm text-gray-500">Head:</span> <span className="text-sm text-gray-900">{viewDept.department_head || '-'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {editDept && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setEditDept(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Edit Department</h2>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Head *</label>
                                <input
                                    type="text"
                                    value={data.department_head}
                                    onChange={(e) => setData('department_head', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.department_head && <p className="text-red-500 text-sm mt-1">{errors.department_head}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                                <input
                                    type="text"
                                    value={data.department_name}
                                    onChange={(e) => setData('department_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.department_name && <p className="text-red-500 text-sm mt-1">{errors.department_name}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditDept(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" disabled={processing} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Delete Department</h3>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this department?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                            <button onClick={confirmDelete} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
} 