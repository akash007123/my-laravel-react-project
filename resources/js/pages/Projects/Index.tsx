import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, type FormEvent, useEffect } from 'react';
import { Eye, Trash2, Pencil, MoreVertical, Plus, Grid3X3, List } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsIndexProps {
    projects: { data: Project[]; links: any[] };
    allProjects: Project[];
    tab?: string;
    user: AuthUser;
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

interface FormData {
    title: string;
    technologies: string[];
    description: string;
    start_date: string;
    end_date: string;
    client_name: string;
    project_manager: string;
    image: File | null;
}

type AuthUser = { name: string; email: string };

export default function ProjectsIndex({ projects, allProjects, tab = 'List', user }: ProjectsIndexProps) {
    const tabs = ['Create', 'List', 'Cards'] as const;
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tab as typeof tabs[number]);
    const [openDropdown, setOpenDropdown] = useState<number | string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const techColors = [
        'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
        'bg-gradient-to-r from-purple-400 to-violet-500 text-white',
        'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
        'bg-gradient-to-r from-indigo-400 to-purple-500 text-white',
        'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
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

    const { data, setData, post, put, reset, errors } = useForm<FormData>({
        title: '',
        technologies: [],
        description: '',
        start_date: '',
        end_date: '',
        client_name: '',
        project_manager: '',
        image: null,
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
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/projects' }]} user={user}>
            <Head title="Projects" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
                {/* Floating Background Elements */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: [0, -20, 0], opacity: 1 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="fixed top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-2xl blur-lg -z-10"
                />
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: [0, 20, 0], opacity: 1 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="fixed bottom-20 right-10 w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-400 to-purple-600 shadow-xl blur-md rotate-12 -z-10"
                />

                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Project Management</h1>
                        <p className="text-gray-600 text-lg">Create, manage, and track your projects</p>
                    </motion.div>

                    {/* Tab Navigation */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-2"
                    >
                        <div className="flex gap-2">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        activeTab === tab 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        router.get(route('projects.index'), { tab }, { 
                                            preserveState: true, 
                                            preserveScroll: true 
                                        });
                                    }}
                                >
                                    {tab === 'Create' && <Plus className="w-4 h-4 inline mr-2" />}
                                    {tab === 'List' && <List className="w-4 h-4 inline mr-2" />}
                                    {tab === 'Cards' && <Grid3X3 className="w-4 h-4 inline mr-2" />}
                                    {tab}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'Create' && (
                            <motion.div
                                key="create"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Plus className="w-6 h-6 mr-3 text-blue-600" />
                                    {editingId ? 'Edit Project' : 'Create New Project'}
                                </h2>
                                <form onSubmit={editingId ? submitUpdate : submitCreate} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                                            <input 
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                value={data.title} 
                                                onChange={e => setData('title', e.target.value)} 
                                                placeholder="Enter project title"
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
                                            <input 
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                value={data.client_name} 
                                                onChange={e => setData('client_name', e.target.value)} 
                                                placeholder="Enter client name"
                                            />
                                            {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea 
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                            rows={4} 
                                            value={data.description} 
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Describe your project"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies</label>
                                        <TechnologyInput values={data.technologies} onAdd={handleAddTechnology} onRemove={removeTechnology} />
                                        {errors.technologies && <p className="text-red-500 text-sm mt-1">{String(errors.technologies)}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                value={data.start_date} 
                                                onChange={e => setData('start_date', e.target.value)} 
                                            />
                                            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                value={data.end_date ?? ''} 
                                                onChange={e => setData('end_date', e.target.value)} 
                                            />
                                            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Manager</label>
                                            <input 
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                value={data.project_manager} 
                                                onChange={e => setData('project_manager', e.target.value)} 
                                                placeholder="Enter manager name"
                                            />
                                            {errors.project_manager && <p className="text-red-500 text-sm mt-1">{errors.project_manager}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Image</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                            onChange={e => setData('image', e.target.files?.[0] ?? null)} 
                                        />
                                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                    </div>

                                    <div className="flex gap-4">
                                        <motion.button 
                                            type="submit" 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {formButtonText}
                                        </motion.button>
                                        {editingId && (
                                            <motion.button 
                                                type="button" 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => { reset(); setEditingId(null); }} 
                                                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'List' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                                        onClick={() => setActiveTab('Create')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Project
                                    </motion.button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Technologies</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Manager</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.data.map((p, index) => (
                                                <motion.tr 
                                                    key={p.id} 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        {p.image_url ? (
                                                            <img
                                                                src={p.image_url}
                                                                alt={p.title}
                                                                className="h-12 w-12 object-cover rounded-xl shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">No image</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900">{p.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {(p.technologies ?? []).map((t, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${techColors[i % techColors.length]}`}
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">{p.client_name}</td>
                                                    <td className="px-6 py-4 text-gray-700">{p.project_manager}</td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        <div className="text-sm">
                                                            <div>{p.start_date}</div>
                                                            <div className="text-gray-500">→ {p.end_date ?? 'Present'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                onClick={() => startEdit(p)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            >
                                                                <Link href={route('projects.show', p.id)}>
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                onClick={() => showDeleteConfirmation(p)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6">
                                    <Pagination links={projects.links} />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Cards' && (
                            <motion.div
                                key="cards"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {allProjects.map((p, index) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 relative group"
                                    >
                                        {/* Dropdown Menu */}
                                        <div className="absolute top-4 right-4 dropdown-container">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setOpenDropdown(openDropdown === p.id ? null : (p.id || null))}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                            </motion.button>
                                            
                                            <AnimatePresence>
                                                {openDropdown === p.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-200 z-10"
                                                    >
                                                        <div className="py-2">
                                                            <Link
                                                                href={`/projects/${p.id}`}
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    startEdit(p);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => showDeleteConfirmation(p)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Image Section */}
                                        <div className="flex justify-center mb-6">
                                            {p.image_url ? (
                                                <motion.img
                                                    whileHover={{ scale: 1.05 }}
                                                    src={p.image_url}
                                                    alt={p.title}
                                                    className="h-32 w-32 rounded-full object-cover shadow-lg border-4 border-white"
                                                />
                                            ) : (
                                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg border-4 border-white">
                                                    <span className="text-gray-500 text-sm">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title and Dates */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                                            <div className="text-sm text-gray-500">
                                                {p.start_date} → {p.end_date ?? 'Present'}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 text-sm mb-4 line-clamp-3 text-center">
                                            {p.description}
                                        </p>

                                        {/* Technologies */}
                                        {p.technologies?.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-2 mb-4">
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
                                        <div className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-800">Client:</span>
                                                <span>{p.client_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-800">Manager:</span>
                                                <span>{p.project_manager}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete the project "{projectToDelete?.title}"? This action cannot be undone.
                                </p>
                                <div className="flex gap-4 justify-end">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={cancelDelete}
                                        className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={confirmDelete}
                                        className="px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Yes, Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                <input 
                    className="flex-1 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={onKeyDown} 
                    placeholder="Type a technology and press Enter" 
                />
                <motion.button 
                    type="button" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { onAdd(input); setInput(''); }} 
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    Add
                </motion.button>
            </div>
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {values.map((t) => (
                        <motion.span 
                            key={t} 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            {t}
                            <motion.button 
                                type="button" 
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => onRemove(t)} 
                                className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                                ×
                            </motion.button>
                        </motion.span>
                    ))}
                </div>
            )}
        </div>
    );
}

function Pagination({ links }: { links: any[] }) {
    if (!links?.length) return null;
    return (
        <div className="flex gap-2 justify-center">
            {links.map((link, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href={link.url || ''}
                        preserveScroll
                        preserveState
                        className={`px-4 py-2 rounded-xl border transition-all ${
                            link.active 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                </motion.div>
            ))}
        </div>
    );
} 