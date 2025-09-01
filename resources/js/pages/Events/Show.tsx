import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Event {
    id: number;
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

interface EventsShowProps {
    event: Event;
}

export default function EventsShow({ event }: EventsShowProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
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

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    function handleDelete() {
        router.delete(route('events.destroy', event.id), {
            onSuccess: () => {
            },
        });
    }

    return (
        <AppLayout>
            <Head title={event.title} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('events.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Events
                        </Link>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('events.edit', event.id)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Event
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Event Image */}
                        <div className="">
                        {event.image_url && (
                            <div className="mb-6">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-84 object-cover mx-auto"
                                />
                            </div>
                        )}
                        </div>

                        {/* Event Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[event.status]}`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>

                            {event.description && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                </div>
                            )}

                            {/* Event Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Date</p>
                                            <p className="text-sm text-gray-600">{formatDate(event.event_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Time</p>
                                            <p className="text-sm text-gray-600">
                                                {event.start_time}
                                                {event.end_time && ` - ${event.end_time}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Location</p>
                                            <p className="text-sm text-gray-600">{event.location}</p>
                                        </div>
                                    </div>

                                    {event.capacity && (
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Capacity</p>
                                                <p className="text-sm text-gray-600">{event.capacity} people</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${tagColors[index % tagColors.length]}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Organizer</p>
                                    <p className="text-sm text-gray-600">{event.organizer}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">Status</p>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">Event Date</p>
                                    <p className="text-sm text-gray-600">{formatDate(event.event_date)}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">Time</p>
                                    <p className="text-sm text-gray-600">
                                        {event.start_time}
                                        {event.end_time && ` - ${event.end_time}`}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                </div>

                                {event.capacity && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Capacity</p>
                                        <p className="text-sm text-gray-600">{event.capacity} people</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('events.edit', event.id)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500/50 backdrop-filter backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
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