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
        <AppLayout
    breadcrumbs={[
        { title: "Projects", href: "/projects" },
        { title: project.title, href: `/projects/${project.id}` },
    ]}
>
    <Head title={`Project: ${project.title}`} />

    <div className="p-6 lg:p-10 space-y-8">
        {/* Back Button */}
        <Link
            href={route("projects.index")}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm transition-all"
        >
            ← Back to Projects
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
                {project.image_url && (
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-40 w-40 rounded-full object-cover shadow-lg border-4 border-gray-100 mb-6"
                    />
                )}
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                    {project.title}
                </h1>
                <p className="text-gray-600 max-w-3xl leading-relaxed">
                    {project.description}
                </p>
            </div>

            {/* Details */}
            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Client
                    </span>
                    <p className="text-gray-800 mt-1 font-medium">
                        {project.client_name}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Project Manager
                    </span>
                    <p className="text-gray-800 mt-1 font-medium">
                        {project.project_manager}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Start Date
                    </span>
                    <p className="text-gray-800 mt-1 font-medium">
                        {project.start_date}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        End Date
                    </span>
                    <p className="text-gray-800 mt-1 font-medium">
                        {project.end_date ?? "Present"}
                    </p>
                </div>
            </div>

            {/* Technologies */}
            {project.technologies?.length > 0 && (
                <div className="mt-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Technologies Used
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {project.technologies.map((tech, i) => (
                            <span
                                key={i}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm border ${techColors[i % techColors.length]}`}
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