import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    user: any;
}

interface ReportFormData {
    report: string;
    start_time: string;
    end_time: string;
    break_duration: string;
}

const ReportsCreate: React.FC<Props> = ({ user }) => {
    const { data, setData, post, processing, errors } = useForm<ReportFormData>({
        report: '',
        start_time: '',
        end_time: '',
        break_duration: '',
    });

    const toAMPM = (val: string) => {
        if (!val) return '';
        const d = new Date(val);
        return isNaN(d.getTime())
            ? ''
            : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reports');
    };

    return (
        <AppLayout user={user}>
            <Head title="Create Report" />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create Report</h1>
                    <Link href="/reports" className="text-blue-600 hover:underline">Back</Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Report Name</label>
                            <input
                                type="text"
                                value={data.report}
                                onChange={(e) => setData('report', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.report && <p className="text-red-500 text-xs italic">{errors.report}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Start Time</label>
                            <input
                                type="datetime-local"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="text-gray-600 mt-1">{toAMPM(data.start_time)}</div>
                            {errors.start_time && <p className="text-red-500 text-xs italic">{errors.start_time}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                            <input
                                type="datetime-local"
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
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Report'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ReportsCreate; 