import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import HolidayDetails from '@/components/HolidayDetails';

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

export default function HolidaysIndex({ holidays, user }: HolidaysIndexProps) {
    console.log('HolidaysIndex', holidays);

    const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
    const [viewHoliday, setViewHoliday] = useState<Holiday | null>(null);
    const [viewHolidayEdits, setViewHolidayEdits] = useState<Holiday | null>(null);
    const { data, setData, put, processing, errors, reset } = useForm({
        holiday_name: '',
        holiday_date: '',
    });

    useEffect(() => {
        if (viewHolidayEdits) {
            setData({
                holiday_name: viewHolidayEdits.holiday_name,
                holiday_date: viewHolidayEdits.holiday_date,
            });
        } else {
            reset();
        }
    }, [viewHolidayEdits]);

    function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!viewHolidayEdits) return;
        put(route('holidays.update', viewHolidayEdits.id), {
            onSuccess: () => setViewHolidayEdits(null),
        });
    }

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

            <div className="container mx-auto px-4 py-10">

                {/* Page Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">🎉 Holidays</h1>
                        <p className="mt-2 text-gray-600">Manage your organization's upcoming holidays</p>
                    </div>
                    <Link
                        href={route('holidays.create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Holiday</span>
                    </Link>
                </div>

                {/* Holidays Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Day', 'Date', 'Holiday', 'Actions'].map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                            No holidays found.{' '}
                                            <Link href={route('holidays.create')} className="text-blue-600 hover:underline">
                                                Add your first holiday
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium">{holiday.day}</td>
                                            <td className="px-6 py-4">{holiday.formatted_date}</td>
                                            <td className="px-6 py-4 font-semibold">{holiday.holiday_name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => setViewHoliday(holiday)}
                                                        className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
                                                        title="View"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setViewHolidayEdits(holiday)}
                                                        className="cursor-pointer text-green-600 hover:text-green-800 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteModal(holiday.id)}
                                                        className="cursor-pointer text-red-600 hover:text-red-800 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
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

            {/* View Modal */}
            {viewHoliday && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg mx-4">
                        <button
                            onClick={() => setViewHoliday(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="max-h-[80vh] overflow-y-auto">
                            <HolidayDetails holiday={viewHoliday} showHeaderActions={false} />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {viewHolidayEdits && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg mx-4">
                        <button
                            onClick={() => setViewHolidayEdits(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="max-h-[80vh] overflow-y-auto p-6">
                            <h3 className="text-xl font-semibold mb-6">Edit {viewHolidayEdits.holiday_name}</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                {/* Holiday Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Holiday Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.holiday_name}
                                        onChange={(e) => setData('holiday_name', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.holiday_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.holiday_name}</p>
                                    )}
                                </div>

                                {/* Holiday Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Holiday Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.holiday_date}
                                        onChange={(e) => setData('holiday_date', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.holiday_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.holiday_date}</p>
                                    )}
                                </div>

                                {/* Optional delete link inside modal */}
                                <div className="text-right">
                                    {/* <button
                                        onClick={() => setShowDeleteModal(viewHolidayEdits.id)}
                                        type="button"
                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-800 transition"
                                        title="Delete this holiday"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button> */}
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end pt-4 border-t border-gray-100 gap-2">
                                    {/* <button
                                        onClick={() => setShowDeleteModal(viewHolidayEdits.id)}
                                        type="button"
                                        className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
                                        title="Delete this holiday"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button> */}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="cursor-pointer flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
                                    >
                                        {processing ? 'Updating...' : 'Update Holiday'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Delete Holiday</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this holiday? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
