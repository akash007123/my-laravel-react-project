import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

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
    const [open, setOpen] = useState(false);
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {department.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No departments yet.</td>
                                    </tr>
                                ) : (
                                    department.map((d) => (
                                        <tr key={d.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.department_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.department_head || '-'}</td>
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



            
        </AppLayout>
    );
} 