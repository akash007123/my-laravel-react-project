import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheck, Users, BriefcaseBusiness, CalendarDays, Image,
    Building, UserPen, BadgeIndianRupee, ChevronRight,
    ArrowUpRight, Plus, TrendingUp, MapPin, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateOnly, formatDateTimeDay } from './utils';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type DashboardUser = { name: string; email: string };
type RecentProject = { id: number; title: string; project_manager: string; image_url: string | null };
type RecentEvent = { id: number; title: string; event_date: string; status: string; image_url: string | null };
type RecentHoliday = { id: number; holiday_name: string; holiday_date: string; day: string };
type RecentDepartment = { id: number; department_name: string; department_head: string };
type RecentApplicant = { id: number; name: string; email: string; mobile: string, city: string };
type RecentLead = { id: number; full_name: string; email: string; company_name: string; country: string; }

const Section = ({ title, link, dark, children }: any) => (
    <div className={`${dark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl shadow p-5`}>
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Link href={link} className="text-sm hover:text-blue-800 flex items-center">
                View all <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

export default function Dashboard({
    user,
    totalEvents, totalProjects, totalUsers, totalHolidays,
    totalGallery, totalDepartments, totalReports, totalLeads, totalApplicants, totalBlog,
    recentProjects = [], recentEvents = [], recentHolidays = [],
    recentDepartments = [], recentApplicants = [], recentLeads = [],
}: {
    user: DashboardUser;
    totalEvents?: number; totalProjects?: number; totalUsers?: number;
    totalHolidays?: number; totalGallery?: number; totalDepartments?: number;
        totalReports?: number; totalLeads?: number; totalApplicants?: number; totalBlog?: number;
    recentProjects?: RecentProject[]; recentEvents?: RecentEvent[];
    recentHolidays?: RecentHoliday[]; recentDepartments?: RecentDepartment[];
    recentApplicants?: RecentApplicant[]; recentLeads?: RecentLead[];
}) {
    const stats = [
        { title: 'Total Events', count: totalEvents || 0, icon: <CalendarCheck className="w-5 h-5" />, link: '/events', color: 'blue', trend: 12.5 },
        { title: 'Total Users', count: totalUsers || 0, icon: <Users className="w-5 h-5" />, link: '/users', color: 'green', trend: 8.2 },
        { title: 'Total Projects', count: totalProjects || 0, icon: <BriefcaseBusiness className="w-5 h-5" />, link: '/projects', color: 'purple', trend: 5.7 },
        { title: 'Total Holidays', count: totalHolidays || 0, icon: <CalendarDays className="w-5 h-5" />, link: '/holidays', color: 'red', trend: -2.1 },
        { title: 'Total Gallery', count: totalGallery || 0, icon: <Image className="w-5 h-5" />, link: '/gallery', color: 'yellow', trend: 15.3 },
        { title: 'Total Departments', count: totalDepartments || 0, icon: <Building className="w-5 h-5" />, link: '/department', color: 'indigo', trend: 3.4 },
        { title: 'Total Reports', count: totalReports || 0, icon: <UserPen className="w-5 h-5" />, link: '/reports', color: 'orange', trend: 7.8 },
        { title: 'Leads', count: totalLeads || 0, icon: <BadgeIndianRupee className='w-5 h-5' />, link: '/leads', color: 'pink', trend: 22.4 },
        { title: 'Applicants', count: totalApplicants || 0, icon: <Users className="w-5 h-5" />, link: '/applicants', color: 'green', trend: 18.6 },
        { title: 'Blog', count: totalBlog || 0, icon: <Users className="w-5 h-5" />, link: '/blogs', color: 'green', trend: 18.6 },
    ];

    const statusColors: Record<string, string> = {
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
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user.name}! Here's what's happening today.</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-700">{formatDateTimeDay(new Date().toISOString())}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {stats.map((item, idx) => (
                        <motion.div key={idx}
                            className="bg-white rounded-xl shadow-sm border p-5 flex flex-col cursor-pointer group hover:shadow-md relative overflow-hidden"
                            whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-10 bg-gray-400"></div>
                            <Link href={item.link} className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-lg bg-${item.color}-100 text-${item.color}-600`}>{item.icon}</div>
                                    <ArrowUpRight className={`w-4 h-4 text-${item.color}-600 opacity-0 group-hover:opacity-100`} />
                                </div>
                                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{item.count}</p>
                                    <div className={`flex items-center text-xs font-medium ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <TrendingUp className={`w-3 h-3 mr-1 ${item.trend < 0 ? 'rotate-180' : ''}`} />
                                        {item.trend > 0 ? '+' : ''}{item.trend}%
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Projects */}
                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200">
                            {recentProjects.length > 0 && (
                                <Section title="Recent Projects" link="/projects" dark>
                                    {recentProjects.map(p => (
                                        <Link key={p.id} href={route('projects.show', p.id)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group border">
                                            {p.image_url
                                                ? <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                                                : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <BriefcaseBusiness className="w-6 h-6 text-gray-400" />
                                                </div>}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate group-hover:text-blue-600">{p.title}</h3>
                                                <p className="text-sm truncate">Manager: {p.project_manager}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                        </Link>
                                    ))}
                                </Section>
                            )}
                        </div>

                        {/* Events */}
                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                            {recentEvents.length > 0 && (
                                <Section title="Upcoming Events" link="/events" className="">
                                    {recentEvents.map(e => (
                                        <Link key={e.id} href={route('events.show', e.id)}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group border">
                                            {e.image_url
                                                ? <img src={e.image_url} alt={e.title} className="w-12 h-12 rounded-lg object-cover" />
                                                : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <CalendarCheck className="w-6 h-6 text-gray-400" />
                                                </div>}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate group-hover:text-blue-600">{e.title}</h3>
                                                <p className="text-sm text-gray-500">{formatDateOnly(e.event_date)}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[e.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {e.status}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-2" />
                                        </Link>
                                    ))}
                                </Section>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                        {/* Applicants */}
                        {recentApplicants.length > 0 && (
                            <Section title="Job Applicants" link="/applicants">
                                {recentApplicants.map(a => (
                                    <Link key={a.id} href={route('applicants.show', a.id)}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group border">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">{a.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate group-hover:text-blue-600">{a.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{a.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{a.mobile}</p>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex gap-1"><MapPin className='w-4 h-4' /> {a.city}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                    </Link>
                                ))}
                            </Section>
                            )}
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                        {/* Leads */}
                        {recentLeads.length > 0 && (
                            <Section title="Recent Leads" link="/leads">
                                {recentLeads.map(l => (
                                    <Link  href={route('leads.index')}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group border">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">{l.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate group-hover:text-blue-600">{l.full_name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{l.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{l.country}</p>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 flex gap-1"><Building2 className='w-4 h-4' /> {l.company_name}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                    </Link>
                                ))}
                            </Section>
                            )}
                            </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        {/* Holidays */}
                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                            {recentHolidays.length > 0 && (
                                <Section title="Upcoming Holidays" link="/holidays">
                                    {recentHolidays.map(h => (
                                        <Link key={h.id} href={route('holidays.show', h.id)}
                                            className="block p-3 rounded-lg hover:bg-gray-50 group border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                        <CalendarDays className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium group-hover:text-blue-600">{h.holiday_name}</h3>
                                                        <p className="text-sm text-gray-500">{formatDateOnly(h.holiday_date)} • {h.day}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                            </div>
                                        </Link>
                                    ))}
                                </Section>
                            )}
                        </div>

                        {/* Departments */}
                        <div className="bg-white rounded-xl shadow-2xl shadow-gray-800 border border-gray-200 p-5">
                            {recentDepartments.length > 0 && (
                                <Section title="Departments" link="/department">
                                    {recentDepartments.map(d => (
                                        <Link key={d.id} href="/department"
                                            className="block p-3 rounded-lg hover:bg-gray-50 group border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Building className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium group-hover:text-blue-600">{d.department_name}</h3>
                                                        <p className="text-sm text-gray-500">Head: {d.department_head}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                            </div>
                                        </Link>
                                    ))}
                                </Section>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <Section title="Quick Actions" link="#">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { href: '/projects/create', label: 'New Project', icon: <Plus className="w-5 h-5" />, color: 'blue' },
                                    { href: '/events/create', label: 'New Event', icon: <Plus className="w-5 h-5" />, color: 'green' },
                                    { href: '/leads/create', label: 'New Lead', icon: <Plus className="w-5 h-5" />, color: 'purple' },
                                    { href: '/reports/create', label: 'Reports', icon: <UserPen className="w-5 h-5" />, color: 'orange' },
                                ].map(a => (
                                    <Link key={a.href} href={a.href}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg bg-${a.color}-50 hover:bg-${a.color}-100 text-${a.color}-700 border border-${a.color}-100`}>
                                        <div className={`w-10 h-10 bg-${a.color}-100 rounded-full flex items-center justify-center mb-2`}>
                                            {a.icon}
                                        </div>
                                        <span className="text-sm font-medium">{a.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </Section>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
