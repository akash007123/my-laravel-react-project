import React, { useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

interface ReportFormData {
    report: string;
    start_time: string;
    end_time: string;
    break_duration: string;
    total_working_hour: string;
    total_office_hour: string;
}

const ReportsEdit: React.FC<Props> = ({ report, user }) => {
    const { data, setData, put, processing, errors } = useForm<ReportFormData>({
        report: report.report,
        start_time: '',
        end_time: '',
        break_duration: '',
        total_working_hour: '',
        total_office_hour: '',
    });

    useEffect(() => {
        const minutes = Math.round((report.break_duration ?? 0) * 60);
        setData('break_duration', String(minutes));
        setData('total_working_hour', String(report.total_working_hour ?? 0));
        setData('total_office_hour', String(report.total_office_hour ?? 0));
        
        // Extract time from datetime strings
        if (report.start_time) {
            const startDate = new Date(report.start_time);
            setData('start_time', startDate.toTimeString().slice(0, 5));
        }
        if (report.end_time) {
            const endDate = new Date(report.end_time);
            setData('end_time', endDate.toTimeString().slice(0, 5));
        }
    }, []);

    const toAMPM = (val: string) => {
        if (!val) return '';
        const d = new Date(`2000-01-01T${val}`);
        return isNaN(d.getTime())
            ? ''
            : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/reports/${report.id}`);
    };

    return (
        <AppLayout user={user}>
            <Head title={`Edit Report #${report.id}`} />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Edit Report</h1>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Report Name
                            </label>
                            <input
                                type="text"
                                value={data.report}
                                onChange={(e) => setData('report', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.report && <p className="text-red-500 text-xs italic">{errors.report}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="text-gray-600 mt-1">{toAMPM(data.start_time)}</div>
                            {errors.start_time && <p className="text-red-500 text-xs italic">{errors.start_time}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="text-gray-600 mt-1">{toAMPM(data.end_time)}</div>
                            {errors.end_time && <p className="text-red-500 text-xs italic">{errors.end_time}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Break Duration (minutes)</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={data.break_duration}
                                onChange={(e) => setData('break_duration', e.target.value)}
                                placeholder="e.g. 34"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.break_duration && <p className="text-red-500 text-xs italic">{errors.break_duration}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Total Working Hour</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={data.total_working_hour}
                                onChange={(e) => setData('total_working_hour', e.target.value)}
                                placeholder="e.g. 8.5"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.total_working_hour && <p className="text-red-500 text-xs italic">{errors.total_working_hour}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Total Office Hour</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={data.total_office_hour}
                                onChange={(e) => setData('total_office_hour', e.target.value)}
                                placeholder="e.g. 9.0"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.total_office_hour && <p className="text-red-500 text-xs italic">{errors.total_office_hour}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Report'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ReportsEdit;
