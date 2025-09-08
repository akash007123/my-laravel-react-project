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
    working_hour: string;
    total_hour: string;
}

const ReportsCreate: React.FC<Props> = ({ user }) => {
    const { data, setData, post, processing, errors } = useForm<ReportFormData>({
        report: '',
        start_time: '',
        end_time: '',
        break_duration: '',
        working_hour: '',
        total_hour: '',
    });

    const toAMPM = (val: string) => {
        if (!val) return '';
        const d = new Date(`2000-01-01T${val}`);
        return isNaN(d.getTime())
            ? ''
            : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const hhmm = (minutesTotal: number) => {
        const positive = Math.max(0, Math.round(minutesTotal));
        const hh = Math.floor(positive / 60);
        const mm = positive % 60;
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    const parseHHMMToMinutes = (time: string) => {
        if (!time) return null;
        const [h, m] = time.split(':').map((s) => Number(s));
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
    };

    const recalc = (start: string, end: string, breakMinStr: string) => {
        const startMin = parseHHMMToMinutes(start);
        const endMin = parseHHMMToMinutes(end);
        const breakMin = Math.max(0, Math.round(Number(breakMinStr || '0')));
        if (startMin == null || endMin == null) return;
        let total = endMin - startMin;
        if (total < 0) total += 24 * 60; // handle overnight
        const working = Math.max(0, total - breakMin);
        // Store numeric hours (2 decimals) as strings
        setData('total_hour', (total / 60).toFixed(2));
        setData('working_hour', (working / 60).toFixed(2));
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">Report Description</label>
                            {/* <input
                                type="text"
                                value={data.report}
                                onChange={(e) => setData('report', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            /> */}
                            <textarea
                                value={data.report}
                                onChange={(e) => setData('report', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={6}
                                cols={50}
                            />

                            {errors.report && <p className="text-red-500 text-xs italic">{errors.report}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Start Time</label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => { setData('start_time', e.target.value); recalc(e.target.value, data.end_time, data.break_duration); }}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <div className="text-gray-600 mt-1">{toAMPM(data.start_time)}</div>
                            {errors.start_time && <p className="text-red-500 text-xs italic">{errors.start_time}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) => { setData('end_time', e.target.value); recalc(data.start_time, e.target.value, data.break_duration); }}
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
                                onChange={(e) => { setData('break_duration', e.target.value); recalc(data.start_time, data.end_time, e.target.value); }}
                                placeholder="e.g. 34"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.break_duration && <p className="text-red-500 text-xs italic">{errors.break_duration}</p>}
                        </div>
                        <div className="mb-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Total Working Hour</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={data.working_hour}
                                onChange={(e) => setData('working_hour', e.target.value)}
                                placeholder="e.g. 8.5"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                readOnly
                            />
                            <div className="text-xs text-gray-500 mt-1">{data.start_time && data.end_time ? `≈ ${hhmm(Math.max(0, Math.round(Number(data.working_hour || '0') * 60)))}` : ''}</div>
                            {errors.working_hour && <p className="text-red-500 text-xs italic">{errors.working_hour}</p>}
                        </div>
                        <div className="mb-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Total Office Hour</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={data.total_hour}
                                onChange={(e) => setData('total_hour', e.target.value)}
                                placeholder="e.g. 9.0"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                readOnly
                            />
                            <div className="text-xs text-gray-500 mt-1">{data.start_time && data.end_time ? `≈ ${hhmm(Math.max(0, Math.round(Number(data.total_hour || '0') * 60)))}` : ''}</div>
                            {errors.total_hour && <p className="text-red-500 text-xs italic">{errors.total_hour}</p>}
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