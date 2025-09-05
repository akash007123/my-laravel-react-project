import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheck,
    Users,
    BriefcaseBusiness,
    CalendarDays,
    Image,
    Building,
    UserPen,
    BadgeIndianRupee
} from 'lucide-react';
import { motion, time } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardUser = { name: string; email: string };

export default function Dashboard({
    user,
    totalEvents,
    totalProjects,
    totalUsers,
    totalHolidays,
    totalGallery,
    totalDepartments,
    totalReports,
    totalLeads,
    totalApplicants,
}: {
    user: DashboardUser;
    totalEvents?: number;
    totalProjects?: number;
    totalUsers?: number;
    totalHolidays?: number;
    totalGallery?: number;
    totalDepartments?: number;
    totalReports?: number;
    totalLeads?: number;
    totalApplicants?: number;
}) {
    const stats = [
        {
            title: 'Total Events',
            count: totalEvents || 0,
            icon: <CalendarCheck className="w-7 h-7 text-blue-600" />,
            link: '/events',
            gradient: 'from-blue-500/10 to-blue-500/30',
        },
        {
            title: 'Total Users',
            count: totalUsers || 0,
            icon: <Users className="w-7 h-7 text-green-600" />,
            link: '/users',
            gradient: 'from-green-500/10 to-green-500/30',
        },
        {
            title: 'Total Projects',
            count: totalProjects || 0,
            icon: <BriefcaseBusiness className="w-7 h-7 text-purple-600" />,
            link: '/projects',
            gradient: 'from-purple-500/10 to-purple-500/30',
        },
        {
            title: 'Total Holidays',
            count: totalHolidays || 0,
            icon: <CalendarDays className="w-7 h-7 text-red-600" />,
            link: '/holidays',
            gradient: 'from-red-500/10 to-red-500/30',
        },
        {
            title: 'Total Gallery',
            count: totalGallery || 0,
            icon: <Image className="w-7 h-7 text-yellow-600" />,
            link: '/gallery',
            gradient: 'from-yellow-500/10 to-yellow-500/30',
        },
        {
            title: 'Total Departments',
            count: totalDepartments || 0,
            icon: <Building className="w-7 h-7 text-orange-600" />,
            link: '/department',
            gradient: 'from-orange-500/10 to-orange-500/30',
        },
        {
            title: 'Total Reports',
            count: totalReports || 0,
            icon: <UserPen className="w-7 h-7 text-orange-600" />,
            link: '/reports',
            gradient: 'from-orange-500/10 to-orange-500/30',
        },
        {
            title: 'Leads',
            count: totalLeads || 0,
            icon: <BadgeIndianRupee className='w-7 h-7 text-red-600'/>,
            link: '/leads',
            gradient: 'from-blue-100 to-red-200'
        },
        {
            title: 'Applicants',
            count: totalApplicants || 0,
            icon: <Users className="w-7 h-7 text-indigo-600" />,
            link: '/applicants',
            gradient: 'from-indigo-500/10 to-indigo-500/30',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Dashboard" />

            <motion.div
                className="flex h-full flex-1 flex-col gap-6 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Welcome Card */}
                {/* <motion.div
                    className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        👋 Welcome, {user.name}!
                    </h2>
                    <div className="space-y-2 text-lg">
                        <p className="text-gray-700">
                            <span className="font-semibold">Name:</span> {user.name}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                </motion.div> */}

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={`relative bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg p-6 flex items-center space-x-5 cursor-pointer group transform-gpu hover:shadow-2xl`}
                            whileHover={{ y: -8, scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            {/* Icon */}
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            {/* Content */}
                            <div>
                                <Link href={item.link}>
                                    <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition">
                                        {item.title}
                                    </h3>
                                    <p className="text-3xl font-extrabold text-gray-900 group-hover:text-black transition">
                                        {item.count}
                                    </p>
                                </Link>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition duration-300 blur-lg" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AppLayout>
    );
}
