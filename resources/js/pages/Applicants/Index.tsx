import AppLayout from '@/layouts/app-layout';
import ApplicantDetails from './ApplicantDetails';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Eye, Trash2, Pencil, RefreshCw } from 'lucide-react';

interface Applicant {
    id: number;
    name: string;
    email: string;
    mobile: string;
    alternate_mobile?: string | null;
    resume?: string | null;
    skills?: string | null;
    dob?: string | null;
    marital_status?: string | null;
    gender?: string | null;
    experience?: string | null;
    joining_timeframe?: string | null;
    bond_agreement?: boolean;
    branch?: string | null;
    graduate_year?: string | null;
    street_address?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string | null;
    prev_page_url?: string | null;
}

interface PageProps {
    [key: string]: any;
    auth: { user: { name: string; email: string } };
    flash?: { success?: string };
    applicants: Pagination<Applicant>;
}

export default function ApplicantsIndex() {
    const { auth, flash, applicants } = usePage<PageProps>().props;

    const [viewItem, setViewItem] = useState<Applicant | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Applicant | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(!!flash?.success);

    const handleFullPageRefresh = () => {
        window.location.reload();
    };

    // Filter applicants based on search query
    const filteredApplicants = applicants.data.filter(applicant =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.mobile.includes(searchQuery)
    );

    function confirmDelete() { if (!deleteItem) return; router.post(route('applicants.destroy', deleteItem.id), { _method: 'delete' } as any, { onSuccess: () => setDeleteItem(null) } as any); }

    async function openView(id: number) {
        try {
            const res = await fetch(route('applicants.show', id), { headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                const item = await res.json();
                setViewItem(item);
                setViewOpen(true);
            }
        } catch (e) {
            // ignore
        }
    }
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <AppLayout user={auth.user}>
            <Head title="Applicants" />

            <div className="container mx-auto px-4 py-6">
                {showSuccess && flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md shadow-sm transition-opacity duration-500 ease-in-out">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}


                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Applicant Management</h1>
                        <p className="text-gray-600 mt-1">Manage and review all job applicants</p>
                    </div>
                    <button
                        onClick={() => router.visit(route('applicants.create'))}
                        className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Applicant
                    </button>
                </div>

                {/* Search Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-200 flex justify-end">
                        <div className="w-full max-w-md">
                            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search applicants by name, email or phone..."
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleFullPageRefresh}
                                        className="cursor-pointer px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                    >
                                        <RefreshCw />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th> */}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredApplicants.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applicants found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {searchQuery ? 'Try adjusting your search query' : 'Get started by creating a new applicant.'}
                                            </p>
                                            {!searchQuery && (
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => router.visit(route('applicants.create'))}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        New Applicant
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : filteredApplicants.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-800 font-medium">
                                                            {a.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{a.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {a.experience ? `${a.experience} years` : 'No experience'}
                                                    </div>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{a.email}</div>
                                            <div className="text-sm text-gray-500">{a.mobile}</div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{a.experience}</div>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => openView(a.id)}
                                                    className="cursor-pointer text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors duration-150"
                                                    title="View details"
                                                >
                                                    <Eye className='w-4 h-4' />
                                                </button>
                                                <button
                                                    onClick={() => router.visit(route('applicants.edit', a.id))}
                                                    className="cursor-pointer text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-colors duration-150"
                                                    title="Edit"
                                                >
                                                    <Pencil className='w-4 h-4' />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteItem(a)}
                                                    className="cursor-pointer text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors duration-150"
                                                    title="Delete"
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {applicants.data.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{applicants.data.length}</span> of{' '}
                                        <span className="font-medium">{applicants.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            1
                                        </a>
                                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            2
                                        </a>
                                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteItem && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-xl w-full max-w-md p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Applicant</h3>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Are you sure you want to delete <span className="font-medium">{deleteItem.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setDeleteItem(null)}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewOpen && viewItem && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-xl w-full max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className=" justify-end px-6 py-4 border-b">
                                {/* <h3 className="text-xl font-semibold text-gray-900">Applicant Details</h3> */}
                                <button
                                    onClick={() => { setViewOpen(false); setViewItem(null); }}
                                    className="cursor-pointer text-gray-500 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ApplicantDetails applicant={viewItem as any} embedded />
                            <div className="flex justify-end px-6 py-4 border-t">
                                <button
                                    onClick={() => { setViewOpen(false); setViewItem(null); }}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}