import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, type FormEvent, useEffect } from 'react';
import { Eye, Trash2, Pencil, MoreVertical } from 'lucide-react';

interface ProjectsIndexProps {
    projects: { data: Project[]; links: any[] };
    allProjects: Project[];
    tab?: string;
}

interface Project {
    id?: number | string;
    title: string;
    technologies: string[];
    description?: string;
    start_date: string;
    end_date?: string | null;
    client_name: string;
    project_manager: string;
    image_url?: string | null;
}

export default function ProjectsIndex({ projects, allProjects, tab = 'List' }: ProjectsIndexProps) {
    const tabs = ['Create', 'List', 'Cards'] as const;
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tab as typeof tabs[number]);
    const [openDropdown, setOpenDropdown] = useState<number | string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const techColors = [
        'bg-yellow-100 text-yellow-800',
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-violet-100 text-violet-800',
        'bg-neutral-100 text-neutral-800'
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (openDropdown !== null && !target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    const { data, setData, post, put, reset, errors } = useForm<any>({
        title: '',
        technologies: [],
        description: '',
        start_date: '',
        end_date: '',
        client_name: '',
        project_manager: '',
        image: null as File | null,
    });

    const [editingId, setEditingId] = useState<number | string | null>(null);

    function handleAddTechnology(value: string) {
        const v = value.trim();
        if (!v) return;
        if (!data.technologies.includes(v)) {
            setData('technologies', [...data.technologies, v]);
        }
    }

    function removeTechnology(value: string) {
        setData('technologies', data.technologies.filter((t: string) => t !== value));
    }

    function submitCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'technologies') {
                (value as string[]).forEach((t, i) => formData.append(`technologies[${i}]`, t));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });
        router.post(route('projects.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setActiveTab('List');
            },
        });
    }

    function startEdit(p: Project) {
        setEditingId(p.id!);
        setData({
            title: p.title,
            technologies: p.technologies ?? [],
            description: p.description ?? '',
            start_date: p.start_date,
            end_date: p.end_date ?? '',
            client_name: p.client_name,
            project_manager: p.project_manager,
            image: null,
        });
        setActiveTab('Create');
    }

    function submitUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (editingId == null) return;
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'technologies') {
                (value as string[]).forEach((t, i) => formData.append(`technologies[${i}]`, t));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });
        router.post(route('projects.update', editingId), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setEditingId(null);
                setActiveTab('List');
            },
            headers: { 'X-HTTP-Method-Override': 'PUT' },
        });
    }

    function showDeleteConfirmation(project: Project) {
        setProjectToDelete(project);
        setShowDeleteModal(true);
        setOpenDropdown(null);
    }

    function cancelDelete() {
        setShowDeleteModal(false);
        setProjectToDelete(null);
    }

    function confirmDelete() {
        if (projectToDelete) {
            router.delete(route('projects.destroy', projectToDelete.id));
            setShowDeleteModal(false);
            setProjectToDelete(null);
        }
    }

    const formButtonText = editingId ? 'Update Project' : 'Create Project';

    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/projects' }]}>
            <Head title="Projects" />

            <div className="p-4 space-y-6">
                <div className="flex gap-2 border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                            onClick={() => {
                                setActiveTab(tab);
                                router.get(route('projects.index'), { tab }, { 
                                    preserveState: true, 
                                    preserveScroll: true 
                                });
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'Create' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="cursor-pointer text-xl font-semibold mb-4">{editingId ? 'Edit Project' : 'Create Project'}</h2>
                        <form onSubmit={editingId ? submitUpdate : submitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Project Title</label>
                                <input className="mt-1 block w-full rounded-md border px-3 py-2" value={data.title} onChange={e => setData('title', e.target.value)} />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Technologies</label>
                                <TechnologyInput values={data.technologies} onAdd={handleAddTechnology} onRemove={removeTechnology} />
                                {errors.technologies && <p className="text-red-500 text-sm mt-1">{String(errors.technologies)}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea className="mt-1 block w-full rounded-md border px-3 py-2" rows={4} value={data.description} onChange={e => setData('description', e.target.value)} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Start Date</label>
                                    <input type="date" className="mt-1 block w-full rounded-md border px-3 py-2" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">End Date</label>
                                    <input type="date" className="mt-1 block w-full rounded-md border px-3 py-2" value={data.end_date ?? ''} onChange={e => setData('end_date', e.target.value)} />
                                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Client Name</label>
                                    <input className="mt-1 block w-full rounded-md border px-3 py-2" value={data.client_name} onChange={e => setData('client_name', e.target.value)} />
                                    {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Project Manager</label>
                                    <input className="mt-1 block w-full rounded-md border px-3 py-2" value={data.project_manager} onChange={e => setData('project_manager', e.target.value)} />
                                    {errors.project_manager && <p className="text-red-500 text-sm mt-1">{errors.project_manager}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Project Image</label>
                                <input type="file" accept="image/*" className="mt-1 block w-full" onChange={e => setData('image', e.target.files?.[0] ?? null)} />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{formButtonText}</button>
                                {editingId && (
                                    <button type="button" onClick={() => { reset(); setEditingId(null); }} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'List' && (
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-semibold">Projects</h2>
                            <button
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                onClick={() => setActiveTab('Create')}
                            >
                                New Project
                            </button>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="min-w-[800px] w-full border border-gray-200 bg-white text-sm rounded-lg">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Title</th>
                                        <th className="px-4 py-2 text-left">Technologies</th>
                                        <th className="px-4 py-2 text-left">Client</th>
                                        <th className="px-4 py-2 text-left">Manager</th>
                                        <th className="px-4 py-2 text-left">Start</th>
                                        <th className="px-4 py-2 text-left">End</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.data.map((p) => (
                                        <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">
                                                {p.image_url ? (
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.title}
                                                        className="h-12 w-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">No image</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">{p.title}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {(p.technologies ?? []).map((t, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-0.5 text-xs bg-gray-100 rounded-md"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">{p.client_name}</td>
                                            <td className="px-4 py-2">{p.project_manager}</td>
                                            <td className="px-4 py-2">{p.start_date}</td>
                                            <td className="px-4 py-2">{p.end_date ?? '-'}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <button
                                                        className="cursor-pointer text-blue-600 hover:underline"
                                                        onClick={() => startEdit(p)}
                                                    >
                                                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                    <Link
                                                        className="cursor-pointer text-green-600 hover:underline"
                                                        href={route('projects.show', p.id)}
                                                    >
                                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </Link>
                                                    <button
                                                        className="cursor-pointer text-red-600 hover:underline"
                                                        onClick={() => showDeleteConfirmation(p)}
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <Pagination links={projects.links} />
                        </div>
                    </div>
                )}


                {activeTab === 'Cards' && (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {allProjects.map(p => (
                            <div
                                key={p.id}
                                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative"
                            >
                                {/* Dropdown Menu */}
                                <div className="absolute top-4 right-4 dropdown-container">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === p.id ? null : (p.id || null))}
                                        className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>
                                    
                                    {openDropdown === p.id && (
                                        <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                            <div className="py-1">
                                                <Link
                                                    href={`/projects/${p.id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        startEdit(p);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        showDeleteConfirmation(p);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Image Section */}
                                <div className="flex justify-center mb-4">
                                    {p.image_url && (
                                        <img
                                            src={p.image_url}
                                            alt={p.title}
                                            className="h-44 w-44 rounded-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Title and Dates */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{p.title}</h3>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {p.start_date} → {p.end_date ?? 'Present'}
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                    {p.description}
                                </p>

                                {/* Technologies */}
                                {p.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {p.technologies.map((t, i) => (
                                            <span
                                                key={i}
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${techColors[i % techColors.length]}`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Client & Manager */}
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>
                                        <span className="font-semibold text-gray-800">Client:</span>{' '}
                                        {p.client_name}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-800">Manager:</span>{' '}
                                        {p.project_manager}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-500/50 backdrop-filter backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete the project "{projectToDelete?.title}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={cancelDelete}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function TechnologyInput({ values, onAdd, onRemove }: { values: string[]; onAdd: (value: string) => void; onRemove: (value: string) => void }) {
    const [input, setInput] = useState('');

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAdd(input);
            setInput('');
        }
    }

    return (
        <div>
            <div className="flex gap-2">
                <input className="mt-1 block w-full rounded-md border px-3 py-2" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Type a technology and press Enter" />
                <button type="button" onClick={() => { onAdd(input); setInput(''); }} className="cursor-pointer px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Add</button>
            </div>
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {values.map((t) => (
                        <span key={t} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-sm">
                            {t}
                            <button type="button" onClick={() => onRemove(t)} className="text-gray-500 hover:text-gray-700">×</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function Pagination({ links }: { links: any[] }) {
    if (!links?.length) return null;
    return (
        <div className="flex gap-2 mt-4">
            {links.map((link, idx) => (
                <Link
                    key={idx}
                    href={link.url || ''}
                    preserveScroll
                    preserveState
                    className={`px-3 py-1 rounded border ${link.active ? 'bg-blue-600 text-white' : 'bg-white'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
} 