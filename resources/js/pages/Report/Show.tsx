import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {formatDate} from '../utils'

interface Props {
    report: Report;
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
    total_working_hour: number;
    total_office_hour: number;
    created_at?: string;
    updated_at?: string;
}

const toMinutes = (hours?: number) => Math.round(Number(hours ?? 0) * 60);

const ReportsShow: React.FC<Props> = ({ report, user }) => {
    console.log('Received report:', report); 
    return (
        <AppLayout user={user}>
            <Head title={`Report #${report.id}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Report Details</h1>
                    <Link
                        href="/reports"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">ID</label>
                            <p className="text-gray-900">{report.id}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Report Name</label>
                            <p className="text-gray-900">{report.report}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Start Time</label>
                            <p className="text-gray-900">{formatDate(report.start_time)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">End Time</label>
                            <p className="text-gray-900">{formatDate(report.end_time)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Working Hours</label>
                            <p className="text-gray-900">
                                {report.working_hour.toFixed(2)}h ({toMinutes(report.working_hour)}m)
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Total Hours</label>
                            <p className="text-gray-900">
                                {report.total_hour.toFixed(2)}h ({toMinutes(report.total_hour)}m)
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Break Duration</label>
                            <p className="text-gray-900">
                                {report.break_duration.toFixed(2)}h ({toMinutes(report.break_duration)}m)
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Total Working Hour</label>
                            <p className="text-gray-900">
                                {report.total_working_hour?.toFixed(2) || '0.00'}h ({toMinutes(report.total_working_hour)}m)
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Total Office Hour</label>
                            <p className="text-gray-900">
                                {report.total_office_hour?.toFixed(2) || '0.00'}h ({toMinutes(report.total_office_hour)}m)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <Link
                        href={`/reports/${report.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit Report
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};

export default ReportsShow;
