import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import WorldMap from '../../components/WorldMap';
type AuthUser = { name: string; email: string };

interface LayoutItem {
    id?: number | string;
}

interface Stats {
    totalEvents: number;
    totalUsers: number;
    totalProjects: number;
    totalHolidays: number;
    totalGallery: number;
    totalDepartments: number;
    totalReports: number;
    totalLeads: number;
}

interface FeatureItem {
    id: number;
    title: string;
    description: string;
    icon?: string;
}

interface FaqItem {
    question: string;
    answer: string;
}

interface TestimonialItem {
    name: string;
    role: string;
    content: string;
    avatar: string;
}

interface LayoutIndexProps {
    user: AuthUser;
    layout?: LayoutItem[];
    stats?: Stats;
    features?: FeatureItem[];
    faqs?: FaqItem[];
    testimonials?: TestimonialItem[];
}

function getIconFor(key?: string) {
    switch (key) {
        case 'users':
            return '👥';
        case 'wallet':
            return '💰';
        case 'clock':
            return '⏰';
        case 'bar-chart':
            return '📊';
        default:
            return '✨';
    }
}

export default function LayoutIndex({ user, layout = [], stats, features = [], faqs = [], testimonials = [] }: LayoutIndexProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeHoverCard, setActiveHoverCard] = useState<number | null>(null);

    const { flash }: any = usePage().props;

    const leadForm = useForm({
        full_name: '',
        email: '',
        company_name: '',
        country: '',
    });

    function submitLead(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        leadForm.post(route('leads.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                leadForm.reset();
            },
        });
    }

    const computedStats = stats || {
        totalEvents: 0,
        totalUsers: 0,
        totalProjects: 0,
        totalHolidays: 0,
        totalGallery: 0,
        totalDepartments: 0,
        totalReports: 0,
        totalLeads: 0,
    };

    return (
        <div>
            <Head title="Layout" />
            {flash?.success && (
                <div className="container mx-auto px-4 pt-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3">
                        {flash.success}
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-900 text-white py-2 text-sm">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-200">Contact Sales: 9685533878</a>
                            <a href="#" className="hover:text-blue-200">Support Portal</a>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href={route('login')}
                                className="hover:text-blue-200"
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register')}
                                className="hover:text-blue-200"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>

                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="text-blue-600 font-bold text-2xl">HRPro</div>
                            </div>

                            <nav className="hidden md:flex space-x-8">
                                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
                                <a href="#stats" className="text-gray-700 hover:text-blue-600 font-medium">Stats</a>
                                <a href="#faqs" className="text-gray-700 hover:text-blue-600 font-medium">FAQ</a>
                                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                            </nav>

                            <div className="flex items-center space-x-4">
                                <button className="hidden md:inline-block bg-white-600 hover:bg-blue-700 hover:text-white border border-blue-800 border-2 text-blue-800 px-4 py-2 rounded-md font-medium">
                                    <Link href={route('login')}>
                                        Login
                                    </Link>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                                >
                                    Get Started
                                </button>

                                <button
                                    className="md:hidden text-gray-700"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {isMenuOpen && (
                            <div className="md:hidden mt-4 pb-4">
                                <a href="#" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Home</a>
                                <a href="#features" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Features</a>
                                <a href="#stats" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Stats</a>
                                <a href="#faqs" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">FAQ</a>
                                <a href="#contact" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button className="w-full text-left py-2 text-blue-600 font-medium">Sign In</button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Modern HR Management Solution</h1>
                            <p className="text-xl mb-8">Streamline your HR processes with our all-in-one platform designed for businesses of all sizes.</p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-bold text-lg"
                                >
                                    Start Free Trial
                                </button>
                                <Link href={route('leads.index')} className="border-2 border-white hover:bg-blue-700 px-6 py-3 rounded-md font-bold text-lg">
                                    View Leads
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="HR Management Dashboard"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </section>

                <section id="stats" className="bg-white">
                    <div className="container mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-700">{computedStats.totalUsers}</div>
                                <div className="text-sm text-blue-800">Users</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-700">{computedStats.totalProjects}</div>
                                <div className="text-sm text-green-800">Projects</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-700">{computedStats.totalEvents}</div>
                                <div className="text-sm text-purple-800">Events</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-orange-700">{computedStats.totalHolidays}</div>
                                <div className="text-sm text-orange-800">Holidays</div>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-pink-700">{computedStats.totalGallery}</div>
                                <div className="text-sm text-pink-800">Gallery</div>
                            </div>
                            <div className="bg-teal-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-teal-700">{computedStats.totalDepartments}</div>
                                <div className="text-sm text-teal-800">Departments</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-700">{computedStats.totalReports}</div>
                                <div className="text-sm text-yellow-800">Reports</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-orange-700">{computedStats.totalLeads}</div>
                                <div className="text-sm text-yellow-800">Leads</div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm">
                        <ol className="flex space-x-2">
                            <li className="text-gray-500">
                                <Link href={route('home')} >
                                    Home
                                </Link>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-500">
                                <Link href={route('dashboard')} >
                                    HR Solutions
                                </Link>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">HRPro Platform</li>
                        </ol>
                    </nav>
                </div>

                <section id="features" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Modern HR Teams</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our comprehensive HRMS platform helps you manage your workforce efficiently and effectively.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                                    onMouseEnter={() => setActiveHoverCard(feature.id)}
                                    onMouseLeave={() => setActiveHoverCard(null)}
                                >
                                    <div className="text-4xl mb-4">{getIconFor(feature.icon)}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>

                                    {activeHoverCard === feature.id && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                                            <p className="text-sm text-blue-800">Learn more about how this feature can benefit your organization.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                            <p className="text-xl text-gray-600">Hear from HR professionals who have transformed their workflows with our platform.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <blockquote key={index} className="bg-white p-8 rounded-lg shadow-md">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-gray-600 text-sm">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>

                {/* World Map */}
                {/* <WorldMap /> */}

                <section>
                    <div className="grid grid-cold-2 md:grid-cold-2 gap-4">
                        <div>
                            <WorldMap />
                        </div>
                    </div>
                </section>
                <section id="faqs" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                            <p className="text-xl text-gray-600">Find answers to common questions about our HRMS platform.</p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b border-gray-200 py-4">
                                    <button className="flex justify-between items-center w-full text-left font-semibold text-lg py-2">
                                        {faq.question}
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="mt-2 text-gray-600">
                                        {faq.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Saved Layouts</h2>
                            <p className="text-gray-600">Showing {layout.length} saved layout{layout.length === 1 ? '' : 's'}.</p>
                        </div>
                        {layout.length === 0 ? (
                            <div className="text-center text-gray-500">No layout items yet.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {layout.map((item, idx) => (
                                    <div key={item.id ?? idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                        <div className="h-32 bg-gray-100 rounded mb-3" />
                                        <div className="text-sm text-gray-600">Layout ID: {String(item.id ?? idx)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section id="contact" className="py-16 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your HR Processes?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of companies that have streamlined their HR operations with our platform.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-md font-bold text-lg"
                        >
                            Get Started Today
                        </button>
                    </div>
                </section>

                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="text-xl font-bold mb-4">HRPro</div>
                                <p className="text-gray-400">The complete HR management solution for modern businesses.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4">Product</h3>
                                <ul className="space-y-2">
                                    <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4">Company</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                                    <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4">Resources</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Webinars</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">API Documentation</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400">© {new Date().getFullYear()} HRPro. All rights reserved.</p>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                                <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
                                <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>

                {isModalOpen && (
                    <div className="fixed inset-0  bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Get Started with HRPro</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-600 mb-6">Fill out the form below to start your free trial.</p>
                            <form className="space-y-4" onSubmit={submitLead}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={leadForm.data.full_name} onChange={(e) => leadForm.setData('full_name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                    {leadForm.errors.full_name && <p className="text-red-600 text-sm mt-1">{leadForm.errors.full_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                                    <input type="email" value={leadForm.data.email} onChange={(e) => leadForm.setData('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                    {leadForm.errors.email && <p className="text-red-600 text-sm mt-1">{leadForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input type="text" value={leadForm.data.company_name} onChange={(e) => leadForm.setData('company_name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                    {leadForm.errors.company_name && <p className="text-red-600 text-sm mt-1">{leadForm.errors.company_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select value={leadForm.data.country} onChange={(e) => leadForm.setData('country', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                        <option value="">Select a country</option>
                                        {countries.map((c) => (
                                            <option key={c.code} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    {leadForm.errors.country && <p className="text-red-600 text-sm mt-1">{leadForm.errors.country}</p>}
                                </div>
                                <button type="submit" disabled={leadForm.processing} className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50">
                                    {leadForm.processing ? 'Submitting...' : 'Start Free Trial'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {isDrawerOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
                            <div className="fixed inset-y-0 right-0 max-w-full flex">
                                <div className="w-screen max-w-md">
                                    <div className="h-full flex flex-col bg-white shadow-xl">
                                        <div className="px-4 py-6 sm:px-6 bg-blue-600 text-white">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-medium">Notification Center</h2>
                                                <button onClick={() => setIsDrawerOpen(false)} className="text-white hover:text-blue-200">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            <div className="text-center py-8">
                                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <p className="mt-4 text-gray-500">You don't have any notifications at this time.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>



    );
}

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'MX', name: 'Mexico' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'FI', name: 'Finland' },
    { code: 'DK', name: 'Denmark' },
    { code: 'SG', name: 'Singapore' },
]; 