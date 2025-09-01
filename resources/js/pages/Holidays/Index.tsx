import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Holiday {
    id: number;
    holiday_name: string;
    holiday_date: string;
    day: string;
    formatted_date: string;
}

interface HolidaysIndexProps {
    holidays: Holiday[];
    user: AuthUser;
}

type AuthUser = { name: string; email: string };

export default function HolidaysIndex({ holidays, user}: HolidaysIndexProps) {
    console.log('HolidaysIndex', holidays);
    
    const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

    function handleDelete(id: number) {
        try {
            router.delete(route('holidays.destroy', id), {
                onSuccess: () => {
                    setShowDeleteModal(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                },
            });
        } catch (error) {
            console.error('Route error:', error);
        }
    }

    return (
        <AppLayout user={user}>
            <Head title="Holidays" />
            
            <div className="container mx-auto px-4 py-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Holidays</h1>
                        <p className="text-gray-600 mt-2">Manage your organization's holidays</p>
                    </div>
                    <Link
                        href={route('holidays.create')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Holiday
                    </Link>
                </div>

                {/* Holidays Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Day
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Holiday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                            No holidays found. <Link href={route('holidays.create')} className="text-blue-600 hover:text-blue-800">Add your first holiday</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {holiday.day}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {holiday.formatted_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {holiday.holiday_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={route('holidays.show', holiday.id)}
                                                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('holidays.edit', holiday.id)}
                                                        className="cursor-pointer text-green-600 hover:text-green-900"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setShowDeleteModal(holiday.id)}
                                                        className="cursor-pointer text-red-600 hover:text-red-900"
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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500/50 backdrop-filter backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Holiday</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this holiday? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
