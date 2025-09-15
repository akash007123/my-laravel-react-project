import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Country }  from 'country-state-city';
import {renderFlag, formatDateTime} from '../utils'
import { Trash2, Pencil } from 'lucide-react';

interface Lead {
    id: number;
    full_name: string;
    email: string;
    company_name?: string | null;
    created_at?: any;
    country?: string | null;
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
    flash?: { success?: string; error?: string };
    leads: Pagination<Lead>;
    filters?: { search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' };
}

export default function LeadsIndex() {
    const { auth, flash, leads, filters } = usePage<PageProps>().props;

    const [createOpen, setCreateOpen] = useState(false);
    const [editLead, setEditLead] = useState<Lead | null>(null);
    const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

    const [search, setSearch] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState(filters?.sortBy || 'created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>(filters?.sortDir || 'desc');

    const [successMsg, setSuccessMsg] = useState<string | null>(flash?.success ?? null);
    useEffect(() => {
        if (flash?.success) {
            setSuccessMsg(flash.success);
            const t = setTimeout(() => setSuccessMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash?.success]);

    const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({ code: c.isoCode, name: c.name, flag: `https://flagcdn.com/24x18/${c.isoCode.toLowerCase()}.png` })), []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('leads.index'), { search, sortBy, sortDir }, { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(timeout);
    }, [search]);

    function toggleSort(column: string) {
        const newDir = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newDir);
        router.get(route('leads.index'), { search, sortBy: column, sortDir: newDir }, { preserveState: true, replace: true });
    }

    const createForm = useForm({ full_name: '', email: '', company_name: '', country: '' });
    const editForm = useForm({ full_name: '', email: '', company_name: '', country: '' });

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post(route('leads.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function openEdit(l: Lead) {
        setEditLead(l);
        editForm.setData({ full_name: l.full_name, email: l.email, company_name: l.company_name || '', country: l.country || '' });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editLead) return;
        router.post(route('leads.update', editLead.id), { ...editForm.data, _method: 'put' }, {
            preserveScroll: true,
            onSuccess: () => setEditLead(null),
        } as any);
    }

    function confirmDelete() {
        if (!deleteLead) return;
        router.post(route('leads.destroy', deleteLead.id), { _method: 'delete' }, {
            preserveScroll: true,
            onSuccess: () => setDeleteLead(null),
        } as any);
    }

    function go(url?: string | null) {
        if (url) router.visit(url, { preserveState: true });
    }

    function SortHeader({ column, children }: { column: string; children: any }) {
        const active = sortBy === column;
        const arrow = active ? (sortDir === 'asc' ? '▲' : '▼') : '';
        return (
            <button onClick={() => toggleSort(column)} className={`flex items-center gap-1 ${active ? 'text-blue-700' : 'text-gray-700'} hover:text-blue-800`}>
                <span className="text-xs font-medium uppercase tracking-wider">{children}</span>
                <span className="text-[10px]">{arrow}</span>
            </button>
        );
    }

    return (
        <AppLayout user={auth.user}>
            <Head title="Leads" />

            <div className="container mx-auto px-4 py-8 overflow-x-hidden">
                {successMsg && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3">{successMsg}</div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, company..."
                            className="px-3 py-2 border border-gray-300 rounded-md w-64"
                        />
                        <button onClick={() => setCreateOpen(true)} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">New Lead</button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left"><SortHeader column="full_name">Name</SortHeader></th>
                                    <th className="px-6 py-3 text-left"><SortHeader column="email">Email</SortHeader></th>
                                    <th className="px-6 py-3 text-left hidden sm:table-cell"><SortHeader column="company_name">Company</SortHeader></th>
                                    <th className="px-6 py-3 text-left hidden md:table-cell"><SortHeader column="country">Country</SortHeader></th>
                                    <th className="px-6 py-3 text-left hidden lg:table-cell"><SortHeader column="created_at">Created</SortHeader></th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No leads found.</td>
                                    </tr>
                                ) : (
                                    leads.data.map((l) => (
                                        <tr key={l.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-[160px] truncate">{l.full_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[220px] truncate">{l.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell max-w-[200px] truncate">{l.company_name || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    {renderFlag(l.country)}
                                                    <span>{l.country || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">{formatDateTime(l.created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => openEdit(l)}
                                                    className="cursor-pointer text-indigo-600 hover:text-indigo-900 p-1.5 rounded-md hover:bg-indigo-50 transition-colors duration-150"
                                                    title="Edit"
                                                >
                                                    <Pencil className='w-4 h-4'/>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteLead(l)}
                                                    className="cursor-pointer text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors duration-150"
                                                    title="Delete"
                                                >
                                                    <Trash2 className='w-4 h-4'/>
                                                </button>
                                            </div>
                                        </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button onClick={() => go(leads.prev_page_url)} className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50" disabled={!leads.prev_page_url}>Previous</button>
                    <div className="text-sm text-gray-600">Page {leads.current_page} of {leads.last_page}</div>
                    <button onClick={() => go(leads.next_page_url)} className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50" disabled={!leads.next_page_url}>Next</button>
                </div>
            </div>

            {/* Create Modal */}
            {createOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setCreateOpen(false)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">×</button>
                        <h2 className="text-lg font-semibold mb-4">New Lead</h2>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input type="text" value={createForm.data.full_name} onChange={(e) => createForm.setData('full_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                {createForm.errors.full_name && <p className="text-red-600 text-sm mt-1">{createForm.errors.full_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                {createForm.errors.email && <p className="text-red-600 text-sm mt-1">{createForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input type="text" value={createForm.data.company_name} onChange={(e) => createForm.setData('company_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                {createForm.errors.company_name && <p className="text-red-600 text-sm mt-1">{createForm.errors.company_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <div className="relative">
                                    <select value={createForm.data.country} onChange={(e) => createForm.setData('country', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none pr-10">
                                        <option value="">Select a country</option>
                                        {countryOptions.map((c) => (
                                            <option key={c.code} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        {renderFlag(createForm.data.country)}
                                    </div>
                                </div>
                                {createForm.errors.country && <p className="text-red-600 text-sm mt-1">{createForm.errors.country}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" disabled={createForm.processing} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{createForm.processing ? 'Creating...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editLead && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setEditLead(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">×</button>
                        <h2 className="text-lg font-semibold mb-4">Edit Lead</h2>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input type="text" value={editForm.data.full_name} onChange={(e) => editForm.setData('full_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                {editForm.errors.full_name && <p className="text-red-600 text-sm mt-1">{editForm.errors.full_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                {editForm.errors.email && <p className="text-red-600 text-sm mt-1">{editForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input type="text" value={editForm.data.company_name} onChange={(e) => editForm.setData('company_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                {editForm.errors.company_name && <p className="text-red-600 text-sm mt-1">{editForm.errors.company_name}</p>}
                            </div>
                            <div>
                                <label className="block text_sm font-medium text-gray-700 mb-1">Country</label>
                                <div className="relative">
                                    <select value={editForm.data.country} onChange={(e) => editForm.setData('country', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none pr-10">
                                        <option value="">Select a country</option>
                                        {countryOptions.map((c) => (
                                            <option key={c.code} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        {renderFlag(editForm.data.country)}
                                    </div>
                                </div>
                                {editForm.errors.country && <p className="text-red-600 text-sm mt-1">{editForm.errors.country}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditLead(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" disabled={editForm.processing} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{editForm.processing ? 'Updating...' : 'Update'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteLead && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w_full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Delete Lead</h3>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete {deleteLead.full_name}?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteLead(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                            <button onClick={confirmDelete} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}