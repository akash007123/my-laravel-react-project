import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import ApplicantDetails from './ApplicantDetails';

interface Applicant {
    id: number; name: string; email: string; mobile: string; alternate_mobile?: string | null; skills?: string | null;
    dob?: string | null; marital_status?: string | null; gender?: string | null; experience?: string | null; joining_timeframe?: string | null;
    bond_agreement?: boolean; branch?: string | null; graduate_year?: string | null; street_address?: string | null; country?: string | null; state?: string | null; city?: string | null;
    resume?: string | null;
}
interface PageProps { [key:string]: any; applicant: Applicant }

export default function ApplicantsShow() {
    const { applicant } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title={`Applicant - ${applicant.name}`} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Applicant Details</h1>
                    <div className="flex gap-2">
                        <button onClick={()=>router.visit(route('applicants.edit', applicant.id))} className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded">Edit</button>
                        <button onClick={()=>router.visit(route('applicants.index'))} className="px-3 py-2 border rounded">Back</button>
                    </div>
                </div>

                <ApplicantDetails applicant={applicant} />
            </div>
        </AppLayout>
    );
} 