import React, { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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
    break_duration: number;
    created_at?: string;
    updated_at?: string;
}

const toMinutes = (hours?: number) => Math.round(Number(hours ?? 0) * 60);

const ReportsIndex: React.FC<Props> = ({ reports, user }) => {
    const [viewItem, setViewItem] = useState<Report | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this report?')) {
            router.delete(`/reports/${id}`);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateOnly = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                                <th className="px-4 py-2">Report</th>
                                <th className="px-4 py-2">Start Time</th>
                                <th className="px-4 py-2">End Time</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.data.map((report) => (
                                <tr key={report.id}>
                                    <td className="border border-rose-800 px-4 border-4 py-2 text-rose-800 bg-rose-100">{formatDateOnly(report.created_at ?? report.start_time)}</td>
                                    <td className="border border-orange-800 px-4 border-4 py-2 text-orange-800 bg-orange-100">{report.report}</td>
                                    <td className="border border-blue-800 px-4 border-4 py-2 text-blue-800 bg-blue-100">{formatTime(report.start_time)}</td>
                                    <td className="border border-lime-800 px-4 border-4 py-2 text-lime-800 bg-lime-100">{formatTime(report.end_time)}</td>
                                    <td className="border px-4  py-2 flex gap-2">
                                        <button
                                            onClick={() => setViewItem(report)}
                                            className=" text-white rounded text-sm"
                                            aria-label="View"
                                        >
                                            👁️
                                        </button>
                                        <Link
                                            href={`/reports/${report.id}/edit`}
                                            className=" text-white rounded text-sm"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(report.id)}
                                            className=" text-white rounded text-sm"
                                        >
                                            🗑️
                                        </button>
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
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
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
                            <div className='mb-2'>
                                <div className="text-gray-500">Date</div>
                                <div className="font-medium text-rose-800 bg-rose-100 p-2">{formatDateOnly(viewItem.created_at ?? viewItem.start_time)}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Report</div>
                                <div className="font-medium text-orange-800 bg-orange-100 p-2">{viewItem.report}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Start Time</div>
                                <div className="font-medium text-blue-800 bg-blue-100 p-2">{formatTime(viewItem.start_time)}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">End Time</div>
                                <div className="font-medium text-lime-800 bg-lime-100 p-2">{formatTime(viewItem.end_time)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default ReportsIndex;