import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

export default function HolidaysCreate() {
    const { data, setData, post, processing, errors } = useForm({
        holiday_name: '',
        holiday_date: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('holidays.store'));
    }

    return (
        <AppLayout>
    <Head title="Add Holiday" />

    <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
            <Link
                href={route('holidays.index')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Holidays
            </Link>
            <h1 className="text-3xl font-semibold text-gray-800">Add Holiday</h1>
        </div>

        <div className="max-w-xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Holiday Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Holiday Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.holiday_name}
                            onChange={(e) => setData('holiday_name', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="e.g., Christmas Day"
                            required
                        />
                        {errors.holiday_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.holiday_name}
                            </p>
                        )}
                    </div>

                    {/* Holiday Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Holiday Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.holiday_date}
                            onChange={(e) => setData('holiday_date', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                        {errors.holiday_date && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.holiday_date}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Creating...' : 'Create Holiday'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</AppLayout>

    );
}