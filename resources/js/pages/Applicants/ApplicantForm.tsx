import { useMemo, useState } from 'react';
import { Country, State, City } from 'country-state-city';

export interface ApplicantFormData {
    name: string; email: string; mobile: string; alternate_mobile?: string; resume?: string; skills?: string; dob?: string;
    marital_status?: string; gender?: string; experience?: string; joining_timeframe?: string; bond_agreement?: boolean;
    branch?: string; graduate_year?: string; street_address?: string; country?: string; state?: string; city?: string;
    resume_file?: File | null;
}

export interface ApplicantFormProps {
    initial: ApplicantFormData;
    submitLabel?: string;
    onSubmit: (data: ApplicantFormData) => void;
    errors?: Record<string, string>;
}

const JOINING_OPTIONS = ['Same week', '2 weeks', '1 month', '3 months', 'Custom'];
const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widow'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export default function ApplicantForm({ initial, onSubmit, submitLabel = 'Save', errors = {} }: ApplicantFormProps) {
    const [data, setData] = useState<ApplicantFormData>(initial);
    const [skills, setSkills] = useState<string[]>((initial.skills || '').split(',').map(s=>s.trim()).filter(Boolean));
    const [skillInput, setSkillInput] = useState('');

    const countries = useMemo(() => Country.getAllCountries().map(c => ({ code: c.isoCode, name: c.name })), []);
    const [countryCode, setCountryCode] = useState<string>(() => countries.find(x=>x.name===initial.country)?.code || '');
    const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
    const [stateCode, setStateCode] = useState<string>(() => states.find(x=>x.name===initial.state)?.isoCode || '');
    const cities = countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];

    function setField<K extends keyof ApplicantFormData>(k: K, v: ApplicantFormData[K]) { setData(prev => ({ ...prev, [k]: v })); }
    function addSkill() { const v = skillInput.trim(); if (!v) return; if (!skills.includes(v)) setSkills([...skills, v]); setSkillInput(''); }
    function removeSkill(s: string) { setSkills(skills.filter(x=>x!==s)); }

    function submit(e: React.FormEvent) { e.preventDefault(); onSubmit({ ...data, skills: skills.join(',') }); }

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={data.name || ''} onChange={e=>setField('name', e.target.value)} className="w-full px-3 py-2 border rounded" required />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={data.email || ''} onChange={e=>setField('email', e.target.value)} className="w-full px-3 py-2 border rounded" required />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                <input value={data.mobile || ''} onChange={e=>setField('mobile', e.target.value)} className="w-full px-3 py-2 border rounded" required />
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt. Mobile</label>
                <input value={data.alternate_mobile || ''} onChange={e=>setField('alternate_mobile', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.alternate_mobile && <p className="mt-1 text-xs text-red-600">{errors.alternate_mobile}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setField('resume_file', e.target.files && e.target.files[0] ? e.target.files[0] : null)} className="w-full" />
                {(errors.resume_file || errors.resume) && <p className="mt-1 text-xs text-red-600">{errors.resume_file || errors.resume}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {skills.map(s => (
                        <span key={s} className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs">{s}<button type="button" onClick={()=>removeSkill(s)} className="ml-2 text-blue-700">×</button></span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter'){ e.preventDefault(); addSkill(); } }} className="w-full px-3 py-2 border rounded" placeholder="Type skill and press Enter" />
                    <button type="button" onClick={addSkill} className="px-3 py-2 border rounded">Add</button>
                </div>
                {errors.skills && <p className="mt-1 text-xs text-red-600">{errors.skills}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                <input type="date" value={data.dob || ''} onChange={e=>setField('dob', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select value={data.marital_status || ''} onChange={e=>setField('marital_status', e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {MARITAL_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                </select>
                {errors.marital_status && <p className="mt-1 text-xs text-red-600">{errors.marital_status}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={data.gender || ''} onChange={e=>setField('gender', e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                </select>
                {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input value={data.experience || ''} onChange={e=>setField('experience', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.experience && <p className="mt-1 text-xs text-red-600">{errors.experience}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Timeframe</label>
                <select value={data.joining_timeframe || ''} onChange={e=>setField('joining_timeframe', e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {JOINING_OPTIONS.map(o=> (<option key={o} value={o}>{o}</option>))}
                </select>
                {data.joining_timeframe === 'Custom' && (
                    <input className="mt-2 w-full px-3 py-2 border rounded" placeholder="Enter custom timeframe" value={data.joining_timeframe || ''} onChange={e=>setField('joining_timeframe', e.target.value)} />
                )}
                {errors.joining_timeframe && <p className="mt-1 text-xs text-red-600">{errors.joining_timeframe}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bond Agreement</label>
                <select value={data.bond_agreement ? 'Yes' : 'No'} onChange={e=>setField('bond_agreement', e.target.value === 'Yes')} className="w-full px-3 py-2 border rounded">
                    <option>No</option>
                    <option>Yes</option>
                </select>
                {errors.bond_agreement && <p className="mt-1 text-xs text-red-600">{errors.bond_agreement}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input value={data.branch || ''} onChange={e=>setField('branch', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.branch && <p className="mt-1 text-xs text-red-600">{errors.branch}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduate Year</label>
                <input value={data.graduate_year || ''} onChange={e=>setField('graduate_year', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.graduate_year && <p className="mt-1 text-xs text-red-600">{errors.graduate_year}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input value={data.street_address || ''} onChange={e=>setField('street_address', e.target.value)} className="w-full px-3 py-2 border rounded" />
                {errors.street_address && <p className="mt-1 text-xs text-red-600">{errors.street_address}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={countryCode} onChange={e=>{ const code = e.target.value; setCountryCode(code); setStateCode(''); const name = countries.find(c=>c.code===code)?.name || ''; setField('country', name); setField('state',''); setField('city',''); }} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {countries.map(c=>(<option key={c.code} value={c.code}>{c.name}</option>))}
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={stateCode} onChange={e=>{ const sc = e.target.value; setStateCode(sc); const name = states.find(s=>s.isoCode===sc)?.name || ''; setField('state', name); setField('city',''); }} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {states.map(s=>(<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
                </select>
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={data.city || ''} onChange={e=>setField('city', e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select</option>
                    {cities.map(c=>(<option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>))}
                </select>
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button type="submit" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">{submitLabel}</button>
            </div>
        </form>
    );
} 