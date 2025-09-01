import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Edit, Trash2, CalendarDays, User, Building } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

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

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href={route('events.index')}
                            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-xl hover:bg-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Events
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Image */}
                            {event.image_url && (
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <motion.img
                                        whileHover={{ scale: 1.02 }}
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                                    />
                                </motion.div>
                            )}

                            {/* Event Details */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{event.title}</h1>
                                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[event.status]}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </div>

                                {event.description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                                        <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
                                    </div>
                                )}

                                {/* Event Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                                    >
                                        <Calendar className="h-6 w-6 text-blue-600 mr-4" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Date</p>
                                            <p className="text-gray-600">{formatDate(event.event_date)}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                                    >
                                        <Clock className="h-6 w-6 text-green-600 mr-4" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Time</p>
                                            <p className="text-gray-600">
                                                {event.start_time}
                                                {event.end_time && ` - ${event.end_time}`}
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100"
                                    >
                                        <MapPin className="h-6 w-6 text-purple-600 mr-4" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Location</p>
                                            <p className="text-gray-600">{event.location}</p>
                                        </div>
                                    </motion.div>

                                    {event.capacity && (
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100"
                                        >
                                            <Users className="h-6 w-6 text-orange-600 mr-4" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Capacity</p>
                                                <p className="text-gray-600">{event.capacity} people</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="mt-8"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {event.tags.map((tag, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${tagColors[index % tagColors.length]}`}
                                                >
                                                    {tag}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sticky top-6"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                                    Event Details
                                </h3>
                                
                                <div className="space-y-6">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                                    >
                                        <div className="flex items-center mb-2">
                                            <User className="w-5 h-5 text-blue-600 mr-2" />
                                            <p className="text-sm font-semibold text-gray-900">Organizer</p>
                                        </div>
                                        <p className="text-gray-700 font-medium">{event.organizer}</p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                                    >
                                        <div className="flex items-center mb-2">
                                            <Building className="w-5 h-5 text-green-600 mr-2" />
                                            <p className="text-sm font-semibold text-gray-900">Status</p>
                                        </div>
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[event.status]}`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100"
                                    >
                                        <div className="flex items-center mb-2">
                                            <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                                            <p className="text-sm font-semibold text-gray-900">Event Date</p>
                                        </div>
                                        <p className="text-gray-700 font-medium">{formatDate(event.event_date)}</p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100"
                                    >
                                        <div className="flex items-center mb-2">
                                            <Clock className="w-5 h-5 text-orange-600 mr-2" />
                                            <p className="text-sm font-semibold text-gray-900">Time</p>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {event.start_time}
                                            {event.end_time && ` - ${event.end_time}`}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100"
                                    >
                                        <div className="flex items-center mb-2">
                                            <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
                                            <p className="text-sm font-semibold text-gray-900">Location</p>
                                        </div>
                                        <p className="text-gray-700 font-medium">{event.location}</p>
                                    </motion.div>

                                    {event.capacity && (
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100"
                                        >
                                            <div className="flex items-center mb-2">
                                                <Users className="w-5 h-5 text-pink-600 mr-2" />
                                                <p className="text-sm font-semibold text-gray-900">Capacity</p>
                                            </div>
                                            <p className="text-gray-700 font-medium">{event.capacity} people</p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            <Link href={route('events.edit', event.id)} className="flex items-center">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowDeleteModal(true)}
                                            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete "{event.title}"? This action cannot be undone.
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
                                        onClick={handleDelete}
                                        className="px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Delete
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