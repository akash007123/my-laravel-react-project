import AppLayout from '@/layouts/app-layout';
import ApplicantDetails from './ApplicantDetails';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Country, State, City } from 'country-state-city';
// console.log(Country.getAllCountries())
console.log(State.getAllStates())

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

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<Applicant | null>(null);
    const [viewItem, setViewItem] = useState<Applicant | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Applicant | null>(null);

    const createForm = useForm({
        name: '', email: '', mobile: '', alternate_mobile: '', resume: '', skills: '', dob: '', marital_status: '', gender: '',
        experience: '', joining_timeframe: '', bond_agreement: false, branch: '', graduate_year: '', street_address: '', country: '', state: '', city: ''
    });
    const editForm = useForm({
        name: '', email: '', mobile: '', alternate_mobile: '', resume: '', skills: '', dob: '', marital_status: '', gender: '',
        experience: '', joining_timeframe: '', bond_agreement: false, branch: '', graduate_year: '', street_address: '', country: '', state: '', city: ''
    });

    const countries = useMemo(() => Country.getAllCountries().map(c => ({ code: c.isoCode, name: c.name })), []);

    // Dependent selects state for Create
    const [createCountryCode, setCreateCountryCode] = useState<string>('');
    const [createStateCode, setCreateStateCode] = useState<string>('');
    const createStates = createCountryCode ? State.getStatesOfCountry(createCountryCode) : [];
    const createCities = createCountryCode && createStateCode ? City.getCitiesOfState(createCountryCode, createStateCode) : [];

    // Dependent selects state for Edit
    const [editCountryCode, setEditCountryCode] = useState<string>('');
    const [editStateCode, setEditStateCode] = useState<string>('');
    const editStates = editCountryCode ? State.getStatesOfCountry(editCountryCode) : [];
    const editCities = editCountryCode && editStateCode ? City.getCitiesOfState(editCountryCode, editStateCode) : [];

    // Skills arrays UI
    const [createSkills, setCreateSkills] = useState<string[]>([]);
    const [createSkillInput, setCreateSkillInput] = useState('');
    const [editSkills, setEditSkills] = useState<string[]>([]);
    const [editSkillInput, setEditSkillInput] = useState('');

    // Joining timeframe custom
    const JOINING_OPTIONS = ['Same week', '2 weeks', '1 month', '3 months', 'Custom'];
    const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widow'];
    const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

    function addCreateSkill() { const v = createSkillInput.trim(); if (!v) return; if (!createSkills.includes(v)) setCreateSkills([...createSkills, v]); setCreateSkillInput(''); }
    function removeCreateSkill(s: string) { setCreateSkills(createSkills.filter(x => x !== s)); }
    function addEditSkill() { const v = editSkillInput.trim(); if (!v) return; if (!editSkills.includes(v)) setEditSkills([...editSkills, v]); setEditSkillInput(''); }
    function removeEditSkill(s: string) { setEditSkills(editSkills.filter(x => x !== s)); }

    function resolveCountryCodeByName(name?: string | null) { const found = countries.find(c => c.name === name); return found?.code || ''; }
    function resolveStateCodeByName(list: { name: string; isoCode: string }[], name?: string | null) { const found = list.find(s => s.name === name); return found?.isoCode || ''; }

    function openEdit(a: Applicant) {
        setEditItem(a);
        setEditSkills((a.skills || '').split(',').map(s=>s.trim()).filter(Boolean));
        const cc = resolveCountryCodeByName(a.country);
        setEditCountryCode(cc);
        const stList = cc ? State.getStatesOfCountry(cc) : [];
        const sc = resolveStateCodeByName(stList, a.state);
        setEditStateCode(sc);
        editForm.setData({
            name: a.name || '', email: a.email || '', mobile: a.mobile || '', alternate_mobile: a.alternate_mobile || '', resume: a.resume || '', skills: a.skills || '',
            dob: a.dob || '', marital_status: a.marital_status || '', gender: a.gender || '', experience: a.experience || '', joining_timeframe: a.joining_timeframe || '',
            bond_agreement: !!a.bond_agreement, branch: a.branch || '', graduate_year: a.graduate_year || '', street_address: a.street_address || '',
            country: a.country || '', state: a.state || '', city: a.city || ''
        });
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.setData('skills', createSkills.join(','));
        router.post(route('applicants.store'), createForm.data as any, { onSuccess: () => setCreateOpen(false) } as any);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault(); if (!editItem) return;
        editForm.setData('skills', editSkills.join(','));
        router.post(route('applicants.update', editItem.id), { ...editForm.data, _method: 'put' } as any, { onSuccess: () => setEditItem(null) } as any);
    }

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

    return (
        <AppLayout user={auth.user}>
            <Head title="Applicants" />

            <div className="container mx-auto px-4 py-8">
                {flash?.success && <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3">{flash.success}</div>}

                <div className="flex items-center justify_between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
                    <button onClick={() => router.visit(route('applicants.create'))} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">New Applicant</button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applicants.data.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No applicants found.</td></tr>
                                ) : applicants.data.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text_sm text-gray-500">{a.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text_sm text-gray-500">{a.mobile}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openView(a.id)} className="cursor-pointer text-indigo-600 hover:text-indigo-800">View</button>
                                                <button onClick={() => router.visit(route('applicants.edit', a.id))} className="cursor-pointer text-blue-600 hover:text-blue-800">Edit</button>
                                                <button onClick={() => setDeleteItem(a)} className="cursor-pointer text-red-600 hover:text-red-800">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {createOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
                        <button onClick={() => setCreateOpen(false)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700">×</button>
                        <h2 className="text-lg font-semibold mb-4">New Applicant</h2>
                        <form onSubmit={submitCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input value={createForm.data.name} onChange={e=>createForm.setData('name', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={createForm.data.email} onChange={e=>createForm.setData('email', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label><input value={createForm.data.mobile} onChange={e=>createForm.setData('mobile', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Alt. Mobile</label><input value={createForm.data.alternate_mobile} onChange={e=>createForm.setData('alternate_mobile', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Skills (chips) */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {createSkills.map(s => (
                                        <span key={s} className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs">
                                            {s}
                                            <button type="button" onClick={()=>removeCreateSkill(s)} className="ml-2 text-blue-700">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={createSkillInput} onChange={e=>setCreateSkillInput(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter'){ e.preventDefault(); addCreateSkill(); } }} className="w-full px-3 py-2 border rounded" placeholder="Type skill and press Enter" />
                                    <button type="button" onClick={addCreateSkill} className="px-3 py-2 border rounded">Add</button>
                                </div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1">DOB</label><input type="date" value={createForm.data.dob} onChange={e=>createForm.setData('dob', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Marital Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select value={createForm.data.marital_status} onChange={e=>createForm.setData('marital_status', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {MARITAL_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select value={createForm.data.gender} onChange={e=>createForm.setData('gender', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {GENDER_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><input value={createForm.data.experience} onChange={e=>createForm.setData('experience', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Joining Timeframe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Timeframe</label>
                                <select value={createForm.data.joining_timeframe} onChange={e=>createForm.setData('joining_timeframe', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {JOINING_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                                {createForm.data.joining_timeframe === 'Custom' && (
                                    <input className="mt-2 w-full px-3 py-2 border rounded" placeholder="Enter custom timeframe" onChange={e=>createForm.setData('joining_timeframe', e.target.value)} />
                                )}
                            </div>

                            {/* Bond Agreement */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bond Agreement</label>
                                <select value={createForm.data.bond_agreement ? 'Yes' : 'No'} onChange={e=>createForm.setData('bond_agreement', e.target.value === 'Yes')} className="w-full px-3 py-2 border rounded">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Branch</label><input value={createForm.data.branch} onChange={e=>createForm.setData('branch', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Graduate Year</label><input value={createForm.data.graduate_year} onChange={e=>createForm.setData('graduate_year', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input value={createForm.data.street_address} onChange={e=>createForm.setData('street_address', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Country/State/City dependent selects (bind value to codes) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <select value={createCountryCode} onChange={e=>{ const code = e.target.value; setCreateCountryCode(code); setCreateStateCode(''); const name = countries.find(c=>c.code===code)?.name || ''; createForm.setData('country', name); createForm.setData('state',''); createForm.setData('city',''); }} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {countries.map(c=>(<option key={c.code} value={c.code}>{c.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select value={createStateCode} onChange={e=>{ const sc = e.target.value; setCreateStateCode(sc); const name = createStates.find(s=>s.isoCode===sc)?.name || ''; createForm.setData('state', name); createForm.setData('city',''); }} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {createStates.map(s=>(<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <select value={createForm.data.city} onChange={e=>createForm.setData('city', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {createCities.map(c=>(<option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>))}
                                </select>
                            </div>

                            <div className="md-ccoal-span-2 flex justify-end gap-3 mt-2"><button type="button" onClick={()=>setCreateOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button><button type="submit" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">Create</button></div>
                        </form>
                    </div>
                </div>
            )}

            {editItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
                        <button onClick={() => setEditItem(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700">×</button>
                        <h2 className="text-lg font-semibold mb-4">Edit Applicant</h2>
                        <form onSubmit={submitEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input value={editForm.data.name} onChange={e=>editForm.setData('name', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={editForm.data.email} onChange={e=>editForm.setData('email', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label><input value={editForm.data.mobile} onChange={e=>editForm.setData('mobile', e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Alt. Mobile</label><input value={editForm.data.alternate_mobile} onChange={e=>editForm.setData('alternate_mobile', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Skills (chips) */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {editSkills.map(s => (
                                        <span key={s} className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs">
                                            {s}
                                            <button type="button" onClick={()=>removeEditSkill(s)} className="ml-2 text-blue-700">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={editSkillInput} onChange={e=>setEditSkillInput(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter'){ e.preventDefault(); addEditSkill(); } }} className="w-full px-3 py-2 border rounded" placeholder="Type skill and press Enter" />
                                    <button type="button" onClick={addEditSkill} className="px-3 py-2 border rounded">Add</button>
                                </div>
                            </div>

                            <div><label className="block text_sm font-medium text-gray-700 mb-1">DOB</label><input type="date" value={editForm.data.dob} onChange={e=>editForm.setData('dob', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Marital Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select value={editForm.data.marital_status} onChange={e=>editForm.setData('marital_status', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {MARITAL_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select value={editForm.data.gender} onChange={e=>editForm.setData('gender', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {GENDER_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                            </div>

                            <div><label className="block text_sm font-medium text-gray-700 mb-1">Experience</label><input value={editForm.data.experience} onChange={e=>editForm.setData('experience', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Joining Timeframe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Timeframe</label>
                                <select value={editForm.data.joining_timeframe} onChange={e=>editForm.setData('joining_timeframe', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {JOINING_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                                </select>
                                {editForm.data.joining_timeframe === 'Custom' && (
                                    <input className="mt-2 w-full px-3 py-2 border rounded" placeholder="Enter custom timeframe" value={editForm.data.joining_timeframe} onChange={e=>editForm.setData('joining_timeframe', e.target.value)} />
                                )}
                            </div>

                            {/* Bond Agreement */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bond Agreement</label>
                                <select value={editForm.data.bond_agreement ? 'Yes' : 'No'} onChange={e=>editForm.setData('bond_agreement', e.target.value === 'Yes')} className="w-full px-3 py-2 border rounded">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>

                            <div><label className="block text_sm font-medium text-gray-700 mb-1">Branch</label><input value={editForm.data.branch} onChange={e=>editForm.setData('branch', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
                            <div><label className="block text_sm font-medium text-gray-700 mb-1">Graduate Year</label><input value={editForm.data.graduate_year} onChange={e=>editForm.setData('graduate_year', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            <div className="md:col-span-2"><label className="block text_sm font-medium text-gray-700 mb-1">Street Address</label><input value={editForm.data.street_address} onChange={e=>editForm.setData('street_address', e.target.value)} className="w-full px-3 py-2 border rounded" /></div>

                            {/* Country/State/City dependent selects (bind value to codes) */}
                            <div>
                                <label className="block text_sm font-medium text-gray-700 mb-1">Country</label>
                                <select value={editCountryCode} onChange={e=>{ const code = e.target.value; setEditCountryCode(code); setEditStateCode(''); const name = countries.find(c=>c.code===code)?.name || ''; editForm.setData('country', name); editForm.setData('state',''); editForm.setData('city',''); }} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {countries.map(c=>(<option key={c.code} value={c.code}>{c.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text_sm font-medium text-gray-700 mb-1">State</label>
                                <select value={editStateCode} onChange={e=>{ const sc = e.target.value; setEditStateCode(sc); const name = editStates.find(s=>s.isoCode===sc)?.name || ''; editForm.setData('state', name); editForm.setData('city',''); }} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {editStates.map(s=>(<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text_sm font-medium text-gray-700 mb-1">City</label>
                                <select value={editForm.data.city} onChange={e=>editForm.setData('city', e.target.value)} className="w-full px-3 py-2 border rounded">
                                    <option value="">Select</option>
                                    {editCities.map(c=>(<option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>))}
                                </select>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-2"><button type="button" onClick={()=>setEditItem(null)} className="px-4 py-2 text-gray-600">Cancel</button><button type="submit" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">Update</button></div>
                        </form>
                    </div>
                </div>
            )}

            {deleteItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Delete Applicant</h3>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete {deleteItem.name}?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={()=>setDeleteItem(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                            <button onClick={confirmDelete} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {viewOpen && viewItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl p-0 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">Applicant Details</h3>
                            <button onClick={()=>{ setViewOpen(false); setViewItem(null); }} className="cursor-pointer text-gray-500">×</button>
                        </div>
                        {/* Reuse the same resume layout as Show.tsx */}
                        <ApplicantDetails applicant={viewItem as any} embedded />
                        <div className="cursor-pointer flex justify-end px-6 py-4 border-t">
                            <button onClick={()=>{ setViewOpen(false); setViewItem(null); }} className="px-4 py-2 border rounded cursor-pointer">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
} 