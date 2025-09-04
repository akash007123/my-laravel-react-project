import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, type FormEvent, useEffect, useMemo } from 'react';
import { Eye, Trash2, Pencil, MoreVertical, Calendar, Clock, MapPin, Users, Plus, Grid3X3, List, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {formatDateWithWeekday} from '../utils'

interface EventsIndexProps {
    events: { data: Event[]; links: any[] };
    allEvents: Event[];
    tab?: string;
    user: AuthUser;
}

interface Event {
    id?: number | string;
    title: string;
    description?: string;
    event_date: string;
    start_time: string;
    end_time?: string | null;
    location: string;
    capacity?: number | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    organizer: string;
    image_url?: string | null;
    tags?: string[];
}

type AuthUser = { name: string; email: string };

export default function EventsIndex({ events, allEvents, tab = 'List', user }: EventsIndexProps) {
    const tabs = ['Create', 'List', 'Cards', 'Calendar'] as const;
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tab as typeof tabs[number]);
    const [openDropdown, setOpenDropdown] = useState<number | string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');

    const statusColors = {
        upcoming: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
        ongoing: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        completed: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
        cancelled: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    };

    const tagColors = [
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

    const { data, setData, post, put, reset, errors } = useForm<{
        title: string;
        description: string;
        event_date: string;
        start_time: string;
        end_time: string;
        location: string;
        capacity: string;
        status: string;
        organizer: string;
        tags: string[];
        image: File | null;
    }>({
        title: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        capacity: '',
        status: 'upcoming',
        organizer: '',
        tags: [],
        image: null as File | null,
    });

    const [editingId, setEditingId] = useState<number | string | null>(null);

    function handleAddTag(value: string) {
        const v = value.trim();
        if (!v) return;
        if (!data.tags.includes(v)) {
            setData('tags', [...data.tags, v]);
        }
    }

    function removeTag(value: string) {
        setData('tags', data.tags.filter((t: string) => t !== value));
    }

    function submitCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'tags') {
                (value as string[]).forEach((t, i) => formData.append(`tags[${i}]`, t));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });
        router.post(route('events.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setActiveTab('List');
            },
        });
    }

    function startEdit(e: Event) {
        setEditingId(e.id || null);
        setData({
            title: e.title,
            description: e.description || '',
            event_date: e.event_date,
            start_time: e.start_time,
            end_time: e.end_time || '',
            location: e.location,
            capacity: e.capacity?.toString() || '',
            status: e.status,
            organizer: e.organizer,
            tags: e.tags || [],
            image: null,
        });
    }

    function submitEdit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'tags') {
                (value as string[]).forEach((t, i) => formData.append(`tags[${i}]`, t));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });
        if (editingId) {
            formData.append('_method', 'PUT');
            router.post(route('events.update', editingId), formData, {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                },
            });
        }
    }

    function cancelEdit() {
        setEditingId(null);
        reset();
    }

    function handleDelete(e: Event) {
        setEventToDelete(e);
        setShowDeleteModal(true);
    }

    function confirmDelete() {
        if (eventToDelete?.id) {
            router.delete(route('events.destroy', eventToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setEventToDelete(null);
                },
            });
        }
    }


    function formatTime(timeString: string) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    function getEventColor(status: string) {
        switch (status) {
            case 'upcoming': return '#3B82F6'; // blue
            case 'ongoing': return '#10B981'; // green
            case 'completed': return '#F59E0B'; // amber
            case 'cancelled': return '#EF4444'; // red
            default: return '#3B82F6'; // blue
        }
    }

    function getEventBgColor(status: string) {
        switch (status) {
            case 'upcoming': return '#EFF6FF'; // light blue
            case 'ongoing': return '#ECFDF5'; // light green
            case 'completed': return '#FFFBEB'; // light amber
            case 'cancelled': return '#FEF2F2'; // light red
            default: return '#EFF6FF'; // light blue
        }
    }

    function getEventTextColor(status: string) {
        switch (status) {
            case 'upcoming': return '#1E40AF'; // dark blue
            case 'ongoing': return '#065F46'; // dark green
            case 'completed': return '#92400E'; // dark amber
            case 'cancelled': return '#991B1B'; // dark red
            default: return '#1E40AF'; // dark blue
        }
    }

    const filteredEvents = useMemo(() => {
        const q = query.trim().toLowerCase();
        return events.data.filter((e) => {
            const matchesQuery = !q || [e.title, e.description, e.location, e.organizer]
                .filter(Boolean)
                .some((v) => v!.toLowerCase().includes(q));
            const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [events.data, query, statusFilter]);

    return (
        <AppLayout user={user}>
            <Head title="Events" />

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
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        router.get(route('events.index'), { tab }, {
                                            preserveState: true,
                                            preserveScroll: true
                                        });
                                    }}
                                >
                                    {tab === 'Create' && <Plus className="w-4 h-4 inline mr-2" />}
                                    {tab === 'List' && <List className="w-4 h-4 inline mr-2" />}
                                    {tab === 'Cards' && <Grid3X3 className="w-4 h-4 inline mr-2" />}
                                    {tab === 'Calendar' && <CalendarDays className="w-4 h-4 inline mr-2" />}
                                    {tab}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {/* Create Tab */}
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
                                    {editingId ? 'Edit Event' : 'Create New Event'}
                                </h2>
                                <form onSubmit={editingId ? submitEdit : submitCreate} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter event title"
                                                required
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer *</label>
                                            <input
                                                type="text"
                                                value={data.organizer}
                                                onChange={(e) => setData('organizer', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter organizer name"
                                                required
                                            />
                                            {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                                            <input
                                                type="date"
                                                value={data.event_date}
                                                onChange={(e) => setData('event_date', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            />
                                            {errors.event_date && <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
                                            <input
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e) => setData('start_time', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            />
                                            {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                            <input
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                            {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                                            <input
                                                type="text"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter event location"
                                                required
                                            />
                                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                                            <input
                                                type="number"
                                                value={data.capacity}
                                                onChange={(e) => setData('capacity', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Maximum attendees"
                                                min="1"
                                            />
                                            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                required
                                            >
                                                <option value="upcoming">Upcoming</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Image</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                accept="image/*"
                                            />
                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Describe your event..."
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {data.tags.map((tag: string, index: number) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`px-3 py-2 rounded-full text-sm font-medium ${tagColors[index % tagColors.length]} flex items-center`}
                                                >
                                                    {tag}
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-2 hover:text-red-200 font-bold"
                                                    >
                                                        ×
                                                    </motion.button>
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a tag and press Enter"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag(e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                                className="flex-1 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                    if (input && input.value.trim()) {
                                                        handleAddTag(input.value.trim());
                                                        input.value = '';
                                                    }
                                                }}
                                                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                Add
                                            </motion.button>
                                        </div>
                                        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                                    </div>

                                    <div className="flex gap-4">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {editingId ? 'Update Event' : 'Create Event'}
                                        </motion.button>
                                        {editingId && (
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={cancelEdit}
                                                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* List Tab */}
                        {activeTab === 'List' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                        <div className="relative flex-1">
                                            <input
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="Search events..."
                                                className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as any)}
                                            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All statuses</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                                            onClick={() => setActiveTab('Create')}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Event
                                        </motion.button>
                                    </div>
                                </div>

                                {filteredEvents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center text-gray-600 py-16">
                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            <Calendar className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <p className="text-lg font-semibold mb-1">No events found</p>
                                        <p className="mb-4">Try adjusting your filters or create a new event.</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg"
                                            onClick={() => setActiveTab('Create')}
                                        >
                                            Create Event
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto hidden md:block">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Organizer</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEvents.map((event, index) => (
                                                    <motion.tr
                                                        key={event.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                {event.image_url ? (
                                                                    <img
                                                                        className="h-12 w-12 rounded-xl object-cover shadow-md mr-4"
                                                                        src={event.image_url}
                                                                        alt={event.title}
                                                                    />
                                                                ) : (
                                                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-md mr-4">
                                                                        <Calendar className="w-6 h-6 text-gray-500" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">{event.title}</div>
                                                                    {event.description && (
                                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                            {event.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">{formatDateWithWeekday(event.event_date)}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {formatTime(event.start_time)}
                                                                {event.end_time && ` - ${formatTime(event.end_time)}`}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">{event.location}</div>
                                                            {event.capacity && (
                                                                <div className="text-sm text-gray-500">
                                                                    Capacity: {event.capacity}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{event.organizer}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <Link href={route('events.show', event.id)}>
                                                                        <Eye className="w-4 h-4" />
                                                                    </Link>
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                >
                                                                    <Link href={route('events.edit', event.id)}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Link>
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    onClick={() => handleDelete(event)}
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
                                )}

                                {/* Mobile Cards */}
                                <div className="grid gap-4 md:hidden">
                                    {filteredEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="bg-white rounded-xl p-4 shadow"
                                        >
                                            <div className="flex items-center gap-3">
                                                {event.image_url ? (
                                                    <img src={event.image_url} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Calendar className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{event.title}</p>
                                                    <p className="text-sm text-gray-500">{formatDateWithWeekday(event.event_date)} • {formatTime(event.start_time)}{event.end_time && ` - ${formatTime(event.end_time)}`}</p>
                                                    <p className="text-sm text-gray-500">{event.location}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('events.show', event.id)} className="text-blue-600">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={route('events.edit', event.id)} className="text-green-600">
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(event)} className="text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Cards Tab */}
                        {activeTab === 'Cards' && (
                            <motion.div
                                key="cards"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {allEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                                    >
                                        {event.image_url ? (
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                className="w-full h-48 object-cover"
                                                src={event.image_url}
                                                alt={event.title}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                <Calendar className="w-16 h-16 text-gray-500" />
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 truncate">{event.title}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[event.status]}`}>
                                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                </span>
                                            </div>

                                            {event.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                            )}

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {formatDateWithWeekday(event.event_date)}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    {formatTime(event.start_time)}
                                                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {event.location}
                                                </div>
                                                {event.capacity && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Capacity: {event.capacity}
                                                    </div>
                                                )}
                                            </div>

                                            {event.tags && event.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {event.tags.map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${tagColors[tagIndex % tagColors.length]}`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">by {event.organizer}</span>
                                                <Link
                                                    href={route('events.show', event.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Calendar Tab */}
                        {activeTab === 'Calendar' && (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 justify-center mb-6">
                                    <span className={`text-sm p-2 rounded-lg ${statusColors.upcoming}`}>Upcoming</span>
                                    <span className={`text-sm p-2 rounded-lg ${statusColors.ongoing}`}>Ongoing</span>
                                    <span className={`text-sm p-2 rounded-lg ${statusColors.completed}`}>Completed</span>
                                    <span className={`text-sm p-2 rounded-lg ${statusColors.cancelled}`}>Cancelled</span>
                                </div>

                                <div className="grid grid-cols-12 gap-6">
                                    {/* Calendar Column */}
                                    <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                                                onClick={() => setActiveTab('Create')}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                New Event
                                            </motion.button>
                                        </div>
                                        <div className="my-calendar-container">
                                            <FullCalendar
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                initialView="dayGridMonth"
                                                headerToolbar={{
                                                    left: 'prev,next today',
                                                    center: 'title',
                                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                }}
                                                weekends={true}
                                                events={allEvents.map(event => {
                                                    let startDate, endDate;
                                                    try {
                                                        startDate = event.event_date.includes('T')
                                                            ? event.event_date
                                                            : `${event.event_date}T${event.start_time}`;
                                                        endDate = event.end_time
                                                            ? (event.event_date.includes('T')
                                                                ? event.event_date.replace(/T.*/, `T${event.end_time}`)
                                                                : `${event.event_date}T${event.end_time}`)
                                                            : undefined;
                                                        startDate = new Date(startDate).toISOString();
                                                        if (endDate) endDate = new Date(endDate).toISOString();
                                                    } catch {
                                                        startDate = event.event_date;
                                                        endDate = event.end_time ? `${event.event_date}T${event.end_time}` : undefined;
                                                    }
                                                    return {
                                                        id: event.id?.toString(),
                                                        title: event.title,
                                                        start: startDate,
                                                        end: endDate,
                                                        backgroundColor: getEventColor(event.status),
                                                        borderColor: getEventColor(event.status),
                                                        textColor: '#ffffff'
                                                    };
                                                })}
                                                eventClick={(info) => {
                                                    if (info.event.id) router.visit(route('events.show', info.event.id));
                                                }}
                                                height="auto"
                                                dayMaxEvents={true}
                                                moreLinkClick="popover"
                                                eventDisplay="block"
                                                eventTimeFormat={{ hour: 'numeric', minute: '2-digit', hour12: true }}
                                                slotMinTime="00:00:00"
                                                slotMaxTime="23:59:59"
                                                nowIndicator={true}
                                                editable={false}
                                                selectable={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Event List Column */}
                                    <div className="col-span-12 lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Event List</h2>
                                        <div className="h-106 overflow-y-auto">
                                            <ul className="space-y-3">
                                                {allEvents.map((event, index) => {
                                                    const statusColor = getEventColor(event.status);
                                                    const bgColor = getEventBgColor(event.status);
                                                    const textColor = getEventTextColor(event.status);

                                                    return (
                                                        <motion.li
                                                            key={event.id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                                            className={`border-l-4 p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:scale-105`}
                                                            style={{
                                                                borderLeftColor: statusColor,
                                                                backgroundColor: bgColor,
                                                            }}
                                                        >
                                                            <div>
                                                                <p className={`font-semibold ${textColor}`}>{event.title}</p>
                                                                <p className={`text-sm ${textColor} opacity-80`}>
                                                                    {event.event_date}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => handleDelete(event)}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <Link href={route('events.show', event.id)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </motion.button>
                                                            </div>
                                                        </motion.li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 to-purple-600 font-bold">
                                            Latest Upcoming Event
                                        </p>

                                        <div className="mt-4 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTzarolVATon0pNEkpg5-qgplhT3enwvTxoZr-6AtXoCT7yt-trlvEroyc4cvsTPYJJYFw8MQyRZFutBAc"
                                                    className="w-64 h-auto object-contain"
                                                    alt="Radhika Das Tour"
                                                />
                                                <p className="mt-2 text-lg font-medium">Radhika Das Tour</p>
                                            </div>

                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src="https://res.cloudinary.com/jetron-mall/image/upload/v1748891754/production/jetron-ticket/events/70394763-7790-4e60-afc7-f1e5b87f9678/media/images/0ce31c7f-74e3-4266-83de-bb3fae8b588a.jpg"
                                                    className="w-64 h-auto object-contain"
                                                    alt="Prom Party"
                                                />
                                                <p className="mt-2 text-lg font-medium">Prom Party</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Delete Modal */}
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
                                    Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
                                </p>
                                <div className="flex gap-4 justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowDeleteModal(false)}
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