import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface Holiday {
    id: number;
    holiday_name: string;
    holiday_date: string;
}

interface HolidaysEditProps {
    holiday: Holiday;
}

export default function HolidaysEdits({ holiday }: HolidaysEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        holiday_name: holiday.holiday_name,
        holiday_date: holiday.holiday_date,
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('holidays.update', holiday.id));
    }

    return (
        <AppLayout>
            <Head title={`Edit ${holiday.holiday_name}`} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Holiday Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Holiday Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.holiday_name}
                                    onChange={(e) => setData('holiday_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter holiday name"
                                    required
                                />
                                {errors.holiday_name && <p className="text-red-500 text-sm mt-1">{errors.holiday_name}</p>}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.holiday_date && <p className="text-red-500 text-sm mt-1">{errors.holiday_date}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer  flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Updating...' : 'Update Holiday'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
