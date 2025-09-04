import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import ApplicantForm, { ApplicantFormData } from './ApplicantForm';

export default function ApplicantsCreate() {
    const { errors } = usePage<any>().props;
    const initial: ApplicantFormData = {
        name: '', email: '', mobile: '', alternate_mobile: '', resume: '', skills: '', dob: '', marital_status: '', gender: '',
        experience: '', joining_timeframe: '', bond_agreement: false, branch: '', graduate_year: '', street_address: '', country: '', state: '', city: ''
    };

    function submit(data: ApplicantFormData) {
        const form = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'resume_file') {
                if (v) form.append('resume_file', v as unknown as Blob);
            } else if (k === 'bond_agreement') {
                form.append('bond_agreement', (v ? '1' : '0'));
            } else if (v !== undefined && v !== null) {
                form.append(k, String(v));
            }
        });
        router.post(route('applicants.store'), form as any, { forceFormData: true, preserveScroll: true, preserveState: true } as any);
    }

    return (
        <AppLayout>
            <Head title="New Applicant" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">New Applicant</h1>
                        <button onClick={()=>router.visit(route('applicants.index'))} className="px-3 py-2 border rounded">Back</button>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <ApplicantForm initial={initial} onSubmit={submit} submitLabel="Create" errors={errors} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 