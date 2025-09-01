import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { ArrowLeft, Save, Plus, Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { motion } from "framer-motion";

export default function EventsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        capacity: '',
        status: 'upcoming',
        organizer: '',
        tags: [] as string[],
        image: null as File | null,
    });

    const [tagInput, setTagInput] = useState('');

    const tagColors = [
        'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
        'bg-gradient-to-r from-purple-400 to-violet-500 text-white',
        'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
        'bg-gradient-to-r from-indigo-400 to-purple-500 text-white',
        'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
    ];

    function handleAddTag() {
        const tag = tagInput.trim();
        if (tag && !data.tags.includes(tag)) {
            setData('tags', [...data.tags, tag]);
            setTagInput('');
        }
    }

    function removeTag(tagToRemove: string) {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'tags') {
                (value as string[]).forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });

        router.post(route('events.store'), formData, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout>
            <Head title="Create Event" />
            
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
                    {/* Header */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <motion.a
                                whileHover={{ x: -5 }}
                                href={route('events.index')}
                                className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-xl hover:bg-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Events
                            </motion.a>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Create New Event</h1>
                    </motion.div>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Plus className="w-6 h-6 mr-3 text-blue-600" />
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Event Title *
                                        </label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Organizer *
                                        </label>
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
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Describe your event..."
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                            </motion.div>

                            {/* Date and Time */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Calendar className="w-6 h-6 mr-3 text-green-600" />
                                    Date and Time
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Event Date *
                                        </label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Time *
                                        </label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                        {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Location and Capacity */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <MapPin className="w-6 h-6 mr-3 text-purple-600" />
                                    Location and Capacity
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location *
                                        </label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Maximum number of attendees"
                                            min="1"
                                        />
                                        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Status and Image */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Users className="w-6 h-6 mr-3 text-orange-600" />
                                    Additional Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status *
                                        </label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Event Image
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            accept="image/*"
                                        />
                                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tags */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Tag className="w-6 h-6 mr-3 text-pink-600" />
                                    Tags
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddTag();
                                                }
                                            }}
                                            className="flex-1 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Add a tag and press Enter"
                                        />
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddTag}
                                            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            Add
                                        </motion.button>
                                    </div>

                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {data.tags.map((tag, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg ${tagColors[index % tagColors.length]}`}
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
                                    )}
                                    {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex justify-end pt-8 border-t border-gray-200"
                            >
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {processing ? 'Creating...' : 'Create Event'}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
} 