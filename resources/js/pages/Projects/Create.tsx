import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ user }: { user: { name: string; email: string } }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        technologies: '' as string | string[],
        description: '',
        start_date: '',
        end_date: '',
        client_name: '',
        project_manager: '',
        is_active: true,
        image: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const payload: any = { ...data };
        // Allow comma-separated technologies string
        if (typeof payload.technologies === 'string') {
            payload.technologies = payload.technologies
                .split(',')
                .map((t: string) => t.trim())
                .filter((t: string) => t.length > 0);
        }
        post(route('projects.store'), { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/projects' }, { title: 'Create', href: '/projects/create' }]} user={user}>
            <Head title="Create Project" />
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
                    <h1 className="text-xl font-semibold mb-4">Create Project</h1>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                />
                                {errors.client_name && <p className="text-sm text-red-600 mt-1">{errors.client_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Manager</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={data.project_manager}
                                    onChange={(e) => setData('project_manager', e.target.value)}
                                />
                                {errors.project_manager && <p className="text-sm text-red-600 mt-1">{errors.project_manager}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={typeof data.technologies === 'string' ? data.technologies : (data.technologies as string[]).join(', ')}
                                    onChange={(e) => setData('technologies', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                Save
                            </button>
                            <Link href="/projects" className="text-gray-600 hover:text-gray-800">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
} 