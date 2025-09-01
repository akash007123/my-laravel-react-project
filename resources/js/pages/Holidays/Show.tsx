import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Holiday {
    id: number;
    holiday_name: string;
    holiday_date: string;
    day: string;
    formatted_date: string;
}

interface HolidaysShowProps {
    holiday: Holiday;
}

export default function HolidaysShow({ holiday }: HolidaysShowProps) {
    return (
        <AppLayout>
            <Head title={holiday.holiday_name} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('holidays.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Holidays
                        </Link>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('holidays.edit', holiday.id)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Holiday
                        </Link>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{holiday.holiday_name}</h1>
                            <p className="text-gray-600">Holiday Details</p>
                        </div>

                        <div className="space-y-6">
                            <div className="border-t border-gray-200 pt-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Holiday Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{holiday.holiday_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Day</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{holiday.day}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{holiday.formatted_date}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 