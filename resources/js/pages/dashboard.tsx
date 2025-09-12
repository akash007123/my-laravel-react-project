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
    BadgeIndianRupee,
    ChevronRight,
    ArrowUpRight,
    Plus,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateOnly, formatDateTimeDay } from './utils'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardUser = { name: string; email: string };
type RecentProject = { id: number; title: string; project_manager: string; image_url: string | null };
type RecentEvent = { id: number; title: string; event_date: string; status: string; image_url: string | null };
type RecentHoliday = { id: number; holiday_name: string; holiday_date: string; day: string; };
type RecentDepartment = { id: number; department_name: string; department_head: string; }
type RecentApplicant = { id: number; name: string; email: string; mobile: string; }

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
    recentProjects = [],
    recentEvents = [],
    recentHolidays = [],
    recentDepartments = [],
    recentApplicants = [],
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
    recentProjects?: RecentProject[];
    recentEvents?: RecentEvent[];
    recentHolidays?: RecentHoliday[];
    recentDepartments?: RecentDepartment[];
    recentApplicants?: RecentApplicant[];
}) {
    const stats = [
        {
            title: 'Total Events',
            count: totalEvents || 0,
            icon: <CalendarCheck className="w-5 h-5" />,
            link: '/events',
            color: 'blue',
            trend: 12.5,
        },
        {
            title: 'Total Users',
            count: totalUsers || 0,
            icon: <Users className="w-5 h-5" />,
            link: '/users',
            color: 'green',
            trend: 8.2,
        },
        {
            title: 'Total Projects',
            count: totalProjects || 0,
            icon: <BriefcaseBusiness className="w-5 h-5" />,
            link: '/projects',
            color: 'purple',
            trend: 5.7,
        },
        {
            title: 'Total Holidays',
            count: totalHolidays || 0,
            icon: <CalendarDays className="w-5 h-5" />,
            link: '/holidays',
            color: 'red',
            trend: -2.1,
        },
        {
            title: 'Total Gallery',
            count: totalGallery || 0,
            icon: <Image className="w-5 h-5" />,
            link: '/gallery',
            color: 'yellow',
            trend: 15.3,
        },
        {
            title: 'Total Departments',
            count: totalDepartments || 0,
            icon: <Building className="w-5 h-5" />,
            link: '/department',
            color: 'indigo',
            trend: 3.4,
        },
        {
            title: 'Total Reports',
            count: totalReports || 0,
            icon: <UserPen className="w-5 h-5" />,
            link: '/reports',
            color: 'orange',
            trend: 7.8,
        },
        {
            title: 'Leads',
            count: totalLeads || 0,
            icon: <BadgeIndianRupee className='w-5 h-5' />,
            link: '/leads',
            color: 'pink',
            trend: 22.4,
        },
        {
            title: 'Applicants',
            count: totalApplicants || 0,
            icon: <Users className="w-5 h-5" />,
            link: '/applicants',
            color: 'teal',
            trend: 18.6,
        },
    ];

    const statusColors = {
        upcoming: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
        ongoing: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        completed: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
        cancelled: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Dashboard" />

            <motion.div
                className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user.name}! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">{formatDateTimeDay(new Date().toISOString())}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col cursor-pointer group hover:shadow-md transition-all relative overflow-hidden`}
                            whileHover={{ y: -5 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-10 bg-gray-400"></div>
                            <Link href={item.link} className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-lg bg-${item.color}-100 text-${item.color}-600`}>
                                        {item.icon}
                                    </div>
                                    <ArrowUpRight className={`w-4 h-4 text-${item.color}-600 opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </div>
                                <div className="mt-auto">
                                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{item.count}</p>
                                        <div className={`flex items-center text-xs font-medium ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            <TrendingUp className={`w-3 h-3 mr-1 ${item.trend < 0 ? 'rotate-180' : ''}`} />
                                            {item.trend > 0 ? '+' : ''}{item.trend}%
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Projects */}
                        {recentProjects.length > 0 && (
                            <div className="bg-gray-800 rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-semibold text-gray-100">Recent Projects</h2>
                                    <Link href="/projects" className="text-sm text-gray-100 hover:text-blue-800 flex items-center">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={route('projects.show', project.id)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                                        >
                                            <div className="flex-shrink-0">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <BriefcaseBusiness className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-sm text-gray-100 group-hover:text-gray-800 truncate">Manager: {project.project_manager}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Events */}
                        {recentEvents.length > 0 && (
                            <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                                    <Link href="/events" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentEvents.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={route('events.show', event.id)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                                        >
                                            <div className="flex-shrink-0">
                                                {event.image_url ? (
                                                    <img
                                                        src={event.image_url}
                                                        alt={event.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <CalendarCheck className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateOnly(event.event_date)}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-blue-100 ${statusColors[event.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                                    {event.status}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-2" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Applicants */}
                        {recentApplicants.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-semibold text-gray-900">Job Applicants</h2>
                                    <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentApplicants.map((applicant) => (
                                        <Link
                                            key={applicant.id}
                                            href={route('applicants.show', applicant.id)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">
                                                    {applicant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {applicant.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {applicant.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">
                                                    {applicant.mobile}
                                                </p>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                                    New
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        {/* Upcoming Holidays */}
                        {recentHolidays.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Holidays</h2>
                                    <Link href="/holidays" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentHolidays.map((holiday) => (
                                        <Link
                                            key={holiday.id}
                                            href={route('holidays.show', holiday.id)}
                                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                        <CalendarDays className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {holiday.holiday_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDateOnly(holiday.holiday_date)} • {holiday.day}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Departments */}
                        {recentDepartments.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
                                    <Link href="/department" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                        View all <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentDepartments.map((department) => (
                                        <Link
                                            href="/department"
                                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Building className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {department.department_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Head: {department.department_head}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/projects/create"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 border border-blue-100"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">New Project</span>
                                </Link>
                                <Link
                                    href="/events/create"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-green-700 border border-green-100"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">New Event</span>
                                </Link>
                                <Link
                                    href="/leads/create"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700 border border-purple-100"
                                >
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">New Lead</span>
                                </Link>
                                <Link
                                    href="/reports/create"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-orange-700 border border-orange-100"
                                >
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                        <UserPen className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">Reports</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}