import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import HolidayDetails from '@/components/HolidayDetails';

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
            <HolidayDetails holiday={holiday} onBackHref={route('holidays.index')} />
        </AppLayout>
    );
} 