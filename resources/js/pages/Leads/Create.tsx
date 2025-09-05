import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ user }: { user: { name: string; email: string } }) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        company_name: '',
        country: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('leads.store'));
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Leads', href: '/leads' }, { title: 'Create', href: '/leads/create' }]} user={user}>
            <Head title="Create Lead" />
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border p-6 max-w-xl">
                    <h1 className="text-xl font-semibold mb-4">Create Lead</h1>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                            />
                            {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                Save
                            </button>
                            <Link href="/leads" className="text-gray-600 hover:text-gray-800">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
} 