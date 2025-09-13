import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Building, Code, Clock } from 'lucide-react';

interface ProjectShowProps {
    project: {
        id: number | string;
        title: string;
        technologies: string[];
        description?: string | null;
        start_date?: string | null;
        end_date?: string | null;
        client_name: string;
        project_manager: string;
        is_active: number;
        image_url?: string | null;
    };
}

export default function ProjectShow({ project }: ProjectShowProps) {
    const techColors = [
        'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
        'bg-gradient-to-r from-purple-400 to-violet-500 text-white',
        'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
        'bg-gradient-to-r from-indigo-400 to-purple-500 text-white',
        'bg-gradient-to-r from-gray-400 to-slate-500 text-white',
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: "Projects", href: "/projects" },
                { title: project.title, href: `/projects/${project.id}` },
            ]}
        >
            <Head title={`Project: ${project.title}`} />

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
                            href={route("projects.index")}
                            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-xl hover:bg-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>
                    </motion.div>

                    {/* Main Card */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="relative p-8 lg:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                {/* Project Image */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="flex-shrink-0"
                                >
                                    {project.image_url ? (
                                        <motion.img
                                            whileHover={{ scale: 1.05, rotate: 2 }}
                                            src={project.image_url}
                                            alt={project.title}
                                            // className="h-48 w-48 rounded-2xl shadow-2xl border-4 border-white/20"
                                            className={`h-48 w-48 rounded-2xl shadow-2xl border border-6 ${project.is_active === 1 ? 'border-green-800' : 'border-red-800'}`}
                                        />
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: 2 }}
                                            className="h-48 w-48 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-2xl border-4 border-white/20"
                                        >
                                            <Building className="w-16 h-16 text-white/60" />
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Project Info */}
                                <div className="flex-1 text-center lg:text-left">
                                    <motion.h1
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="text-4xl lg:text-5xl font-extrabold mb-4"
                                    >
                                        {project.title}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                        className="text-lg leading-relaxed max-w-2x line-clamp-1"
                                    >
                                        {project.description}
                                    </motion.p>

                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 lg:p-12">
                            {/* Project Stats */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                            >
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Client
                                    </span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {project.client_name}
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Project Manager
                                    </span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {project.project_manager}
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center border border-purple-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Start Date
                                    </span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {project.start_date}
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center border border-orange-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        End Date
                                    </span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {project.end_date ?? "Present"}
                                    </p>
                                </motion.div>
                            </motion.div>

                            {/* Technologies Section */}
                            {project.technologies?.length > 0 && (
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center mb-8">
                                        <Code className="w-8 h-8 text-blue-600 mr-3" />
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            Technologies Used
                                        </h2>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {project.technologies.map((tech, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className={`px-6 py-3 text-sm font-semibold rounded-full shadow-lg ${techColors[i % techColors.length]}`}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Project Timeline */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.6 }}
                                className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Project Timeline</h3>
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold">
                                            {project.start_date}
                                        </div>
                                        <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold">
                                            {project.end_date ?? "Present"}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
} 