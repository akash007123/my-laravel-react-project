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
    start_time: string; // TIME or datetime string
    end_time: string;   // TIME or datetime string
    working_hour: string; // TIME string HH:MM:SS
    total_hour: string;   // TIME string HH:MM:SS
    break_duration: string; // TIME string HH:MM:SS
    created_at?: string;
    updated_at?: string;
}

interface ReportFormData {
    report: string;
    start_time: string;
    end_time: string;
    break_duration: string; // minutes string
    working_hour: string;   // decimal hours as string
    total_hour: string;     // decimal hours as string
}

const ReportsEdit: React.FC<Props> = ({ report, user }) => {
    const { data, setData, put, processing, errors } = useForm<ReportFormData>({
        report: report.report,
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
        setData('total_hour', (total / 60).toFixed(2));
        setData('working_hour', (working / 60).toFixed(2));
    };

    useEffect(() => {
        // Extract HH:MM from strings without timezone conversion
        const extractHM = (s?: string) => {
            if (!s) return '';
            const m = s.match(/(\d{2}):(\d{2})/);
            return m ? `${m[1]}:${m[2]}` : '';
        };
        // Parse TIME HH:MM:SS to minutes
        const timeToMinutes = (s?: string) => {
            if (!s) return 0;
            const m = s.match(/(\d{2}):(\d{2})/);
            if (!m) return 0;
            const H = Number(m[1]);
            const M = Number(m[2]);
            return H * 60 + M;
        };

        const start = extractHM(report.start_time);
        const end = extractHM(report.end_time);
        const breakMinutes = timeToMinutes(report.break_duration);

        setData('start_time', start);
        setData('end_time', end);
        setData('break_duration', String(breakMinutes));

        // Compute hours initially
        if (start && end) {
            recalc(start, end, String(breakMinutes));
        }
    }, []);

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
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Start Time
                            </label>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                End Time
                            </label>
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
                            {processing ? 'Updating...' : 'Update Report'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ReportsEdit;
