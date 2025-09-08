import React, { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Eye, Trash2, Pencil } from 'lucide-react';
import { formatTime, formatDateOnly, formatMinute, hoursToHHMM } from '../utils'

interface Props {
    reports: {
        data: Report[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: { current_page: number; last_page: number; per_page: number; total: number };
    };
    user: any;
}

export interface Report {
    id: number;
    report: string;
    start_time: string;
    end_time: string;
    working_hour: number;
    total_hour: number;
    break_duration: string;
    created_at?: string;
    updated_at?: string;
}

const toMinutes = (hours?: number) => Math.round(Number(hours ?? 0) * 60);

const ReportsIndex: React.FC<Props> = ({ reports, user }) => {
    console.log('Received report:', reports);


    const [viewItem, setViewItem] = useState<Report | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this report?')) {
            router.delete(`/reports/${id}`);
        }
    };

    return (
        <AppLayout user={user}>
            <Head title="Reports" />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <Link
                        href="/reports/create"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New Report
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                {/* <th className="px-4 py-2">Report</th> */}
                                <th className="px-4 py-2">Start Time</th>
                                <th className="px-4 py-2">End Time</th>
                                <th className='pc-4 py-2'>Break Duration</th>
                                <th className="px-4 py-2">Total Working Hour</th>
                                <th className="px-4 py-2">Total Office Hour</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.data.map((report) => (
                                <tr key={report.id}>
                                    <td className=" py-2 text-gray-500 text-center">{formatDateOnly(report.created_at ?? report.start_time)}</td>
                                    {/* <td className=" py-2 text-gray-500 text-center">{report.report}</td> */}
                                    <td className=" py-2 text-gray-500 text-center">{formatTime(report.start_time)}</td>
                                    <td className=" py-2 text-gray-500 text-center">{formatTime(report.end_time)}</td>
                                    <td className='py-2 text-gray-500 text-center'>{formatMinute(report.break_duration)} min</td>
                                    <td className=" py-2 text-gray-500 text-center">{hoursToHHMM(report.working_hour)}</td>
                                    <td className=" py-2 text-gray-500 text-center">{hoursToHHMM(report.total_hour)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button
                                                onClick={() => setViewItem(report)}
                                                className="cursor-pointer text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors duration-150"
                                                aria-label="View"
                                            >
                                                <Eye className='w-4 h-4' />
                                            </button>
                                            <Link
                                                href={`/reports/${report.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <Pencil className='w-4 h-4' />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="cursor-pointer text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors duration-150"
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {reports.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            preserveScroll
                            className={`px-3 py-1 rounded border ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {viewItem && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setViewItem(null)}
                            className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            ✖️
                        </button>
                        <h2 className="text-xl text-center font-bold mb-4 bg-[linear-gradient(to_right,_#be123c,_#c2410c,_#1e40af,_#65a30d)] bg-clip-text text-transparent ">
                            Report Details
                        </h2>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Left Side */}
                            <div>
                                <div className="text-gray-500">Report</div>
                                <div className="font-medium text-gray-700 border rounded-lg p-2">{viewItem.report}</div>
                            </div>

                            {/* Right Side */}
                            <div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-gray-500">Start Time</div>
                                        <div className="text-gray-700 p-2">{formatTime(viewItem.start_time)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">End Time</div>
                                        <div className="font-medium text-gray-700 p-2">{formatTime(viewItem.end_time)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Break Duration</div>
                                        <div className="font-medium text-gray-700 p-2">{formatMinute(viewItem.break_duration)} min</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Total Working Hour</div>
                                        <div className="font-medium text-gray-700 p-2">{hoursToHHMM(viewItem.working_hour)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Total Office Hour</div>
                                        <div className="font-medium text-gray-700 p-2">{hoursToHHMM(viewItem.total_hour)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AppLayout>
    );
};

export default ReportsIndex;