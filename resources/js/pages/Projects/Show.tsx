import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

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
        image_url?: string | null;
    };
}

export default function ProjectShow({ project }: ProjectShowProps) {
    const techColors = [
        'bg-yellow-100 text-yellow-800',
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-violet-100 text-violet-800',
        'bg-neutral-100 text-neutral-800',
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: '/projects' },
            { title: project.title, href: `/projects/${project.id}` }
        ]}>
            <Head title={`Project: ${project.title}`} />

            <div className="p-6 space-y-6">
                <Link
                    href={route('projects.index')}
                    className="inline-block text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition"
                >
                    ← Back to Projects
                </Link>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex flex-col items-center text-center">
                        {project.image_url && (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="h-40 w-40 rounded-full object-cover shadow border-4 border-white mb-4"
                            />
                        )}
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                        <p className="text-gray-600 max-w-2xl">{project.description}</p>
                    </div>

                    <div className="mt-8 grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
                        <div>
                            <span className="block font-semibold text-gray-800">Client</span>
                            {project.client_name}
                        </div>
                        <div>
                            <span className="block font-semibold text-gray-800">Project Manager</span>
                            {project.project_manager}
                        </div>
                        <div>
                            <span className="block font-semibold text-gray-800">Start Date</span>
                            {project.start_date}
                        </div>
                        <div>
                            <span className="block font-semibold text-gray-800">End Date</span>
                            {project.end_date ?? 'Present'}
                        </div>
                    </div>

                    {project.technologies?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="font-semibold text-gray-800 mb-2">Technologies Used</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, i) => (
                                    <span
                                        key={i}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${techColors[i % techColors.length]}`}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>

    );
} 