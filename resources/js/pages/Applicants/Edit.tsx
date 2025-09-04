import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import ApplicantForm, { ApplicantFormData } from './ApplicantForm';

interface PageProps { [key: string]: any; applicant: ApplicantFormData & { id: number } }

export default function ApplicantsEdit() {
    const { applicant, errors } = usePage<PageProps & { errors: Record<string, string> }>().props;

    function submit(data: ApplicantFormData) {
        const form = new FormData();
        form.append('_method', 'put');
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'resume_file') {
                if (v) form.append('resume_file', v as unknown as Blob);
            } else if (k === 'bond_agreement') {
                form.append('bond_agreement', (v ? '1' : '0'));
            } else if (v !== undefined && v !== null) {
                form.append(k, String(v));
            }
        });
        router.post(route('applicants.update', applicant.id), form as any, { forceFormData: true, preserveScroll: true, preserveState: true } as any);
    }

    return (
        <AppLayout>
            <Head title={`Edit Applicant - ${applicant.name}`} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Edit Applicant</h1>
                        <button onClick={()=>router.visit(route('applicants.index'))} className="px-3 py-2 border rounded">Back</button>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <ApplicantForm initial={applicant} onSubmit={submit} submitLabel="Update" errors={errors} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 