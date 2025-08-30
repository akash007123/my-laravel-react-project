import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, type FormEvent, useEffect } from 'react';
import { Eye, Trash2, Pencil, MoreVertical, Calendar, Clock, MapPin, Users } from 'lucide-react';

interface EventsIndexProps {
    events: { data: Event[]; links: any[] };
    allEvents: Event[];
    tab?: string;
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

export default function EventsIndex({ events, allEvents, tab = 'List' }: EventsIndexProps) {
    const tabs = ['Create', 'List', 'Cards', 'Calender'] as const;
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tab as typeof tabs[number]);
    const [openDropdown, setOpenDropdown] = useState<number | string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    const statusColors = {
        upcoming: 'bg-blue-100 text-blue-800',
        ongoing: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const tagColors = [
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
            router.put(route('events.update', editingId), formData, {
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

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    function formatTime(timeString: string) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    return (
        <AppLayout>
            <Head title="Events" />

            <div className="p-4 space-y-6">
                <div className="flex gap-2 border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                            onClick={() => {
                                setActiveTab(tab);
                                router.get(route('events.index'), { tab }, {
                                    preserveState: true,
                                    preserveScroll: true
                                });
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Create Tab */}
                {activeTab === 'Create' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organizer *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.organizer}
                                        onChange={(e) => setData('organizer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.event_date}
                                        onChange={(e) => setData('event_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.event_date && <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                    />
                                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        accept="image/*"
                                    />
                                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {data.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[index % tagColors.length]}`}
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'List' && (
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-semibold">Events</h2>
                            <button
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                onClick={() => setActiveTab('Create')}
                            >
                                New Event
                            </button>
                        </div>
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Organizer
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.data.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {event.image_url && (
                                                        <img
                                                            className="h-10 w-10 rounded-lg object-cover mr-3"
                                                            src={event.image_url}
                                                            alt={event.title}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </div>
                                                        {event.description && (
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(event.event_date)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(event.start_time)}
                                                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{event.location}</div>
                                                {event.capacity && (
                                                    <div className="text-sm text-gray-500">
                                                        Capacity: {event.capacity}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.organizer}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="relative dropdown-container">
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === event.id ? null : (event.id || null))}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    {openDropdown === event.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                                            <div className="py-1">
                                                                <Link
                                                                    href={route('events.show', event.id)}
                                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View
                                                                </Link>
                                                                <button
                                                                    onClick={() => startEdit(event)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(event)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Cards Tab */}
                {activeTab === 'Cards' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                                {event.image_url && (
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={event.image_url}
                                        alt={event.title}
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {event.title}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>

                                    {event.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {formatDate(event.event_date)}
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
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {event.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[index % tagColors.length]}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">by {event.organizer}</span>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('events.show', event.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Calender Tab */}
                {activeTab === 'Calender' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                                {event.image_url && (
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={event.image_url}
                                        alt={event.title}
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {event.title}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>

                                    {event.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {formatDate(event.event_date)}
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
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {event.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[index % tagColors.length]}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">by {event.organizer}</span>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('events.show', event.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
} 