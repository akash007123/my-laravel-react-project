import { useMemo, useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

export interface ApplicantFormData {
    name: string;
    email: string;
    mobile: string;
    alternate_mobile?: string;
    resume?: string;
    skills?: string;
    dob?: string;
    marital_status?: string;
    gender?: string;
    experience?: string;
    joining_timeframe?: string;
    bond_agreement?: boolean;
    branch?: string;
    graduate_year?: string;
    street_address?: string;
    country?: string;
    state?: string;
    city?: string;
    resume_file?: File | null;
}

export interface ApplicantFormProps {
    initial: ApplicantFormData;
    submitLabel?: string;
    onSubmit: (data: ApplicantFormData) => void;
    errors?: Record<string, string>;
    successMessage?: string;
    onSuccessMessageClear?: () => void;
}

const JOINING_OPTIONS = ['Same week', '2 weeks', '1 month', '3 months', 'Custom'];
const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widow'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

// Validation functions
const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (/[^a-zA-Z\s]/.test(name)) return 'Name should only contain letters and spaces';
    return null;
};

const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
};

const validateMobile = (mobile: string): string | null => {
    if (!mobile.trim()) return 'Mobile number is required';
    if (!/^\d+$/.test(mobile)) return 'Mobile number should only contain digits';
    if (mobile.length !== 10) return 'Mobile number must be exactly 10 digits';
    return null;
};

const validateResume = (file: File | null): string | null => {
    if (!file) return null; // Resume is optional
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    if (imageExtensions.includes(fileExtension)) {
        return 'Image files are not allowed. Please upload a document file (PDF, DOC, DOCX)';
    }
    
    if (!allowedTypes.includes(fileExtension)) {
        return 'Only PDF, DOC, and DOCX files are allowed';
    }
    
    return null;
};

export default function ApplicantForm({ 
    initial, 
    onSubmit, 
    submitLabel = 'Save', 
    errors = {},
    successMessage,
    onSuccessMessageClear
}: ApplicantFormProps) {
    const [data, setData] = useState<ApplicantFormData>(initial);
    const [skills, setSkills] = useState<string[]>((initial.skills || '').split(',').map(s => s.trim()).filter(Boolean));
    const [skillInput, setSkillInput] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const countries = useMemo(() => Country.getAllCountries().map(c => ({ code: c.isoCode, name: c.name })), []);
    const [countryCode, setCountryCode] = useState<string>(() => countries.find(x => x.name === initial.country)?.code || '');
    const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
    const [stateCode, setStateCode] = useState<string>(() => states.find(x => x.name === initial.state)?.isoCode || '');
    const cities = countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage && onSuccessMessageClear) {
            const timer = setTimeout(() => {
                onSuccessMessageClear();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, onSuccessMessageClear]);

    function setField<K extends keyof ApplicantFormData>(k: K, v: ApplicantFormData[K]) { 
        setData(prev => ({ ...prev, [k]: v })); 
        // Clear validation error when user starts typing
        if (validationErrors[k]) {
            setValidationErrors(prev => ({ ...prev, [k]: '' }));
        }
    }

    function addSkill() { 
        const v = skillInput.trim(); 
        if (!v) return; 
        if (!skills.includes(v)) setSkills([...skills, v]); 
        setSkillInput(''); 
    }

    function removeSkill(s: string) { 
        setSkills(skills.filter(x => x !== s)); 
    }

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
        
        // Validate required fields
        const nameError = validateName(data.name || '');
        if (nameError) newErrors.name = nameError;
        
        const emailError = validateEmail(data.email || '');
        if (emailError) newErrors.email = emailError;
        
        const mobileError = validateMobile(data.mobile || '');
        if (mobileError) newErrors.mobile = mobileError;
        
        // Validate resume file if provided
        const resumeError = validateResume(data.resume_file || null);
        if (resumeError) newErrors.resume_file = resumeError;
        
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function submit(e: React.FormEvent) { 
        e.preventDefault(); 
        
        if (validateForm()) {
            onSubmit({ ...data, skills: skills.join(',') }); 
        }
    }

    // Get error for a field (prioritize validation errors over server errors)
    const getFieldError = (fieldName: string): string => {
        return validationErrors[fieldName] || errors[fieldName] || '';
    };

    return (
        <div>
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input 
                        value={data.name || ''} 
                        onChange={e => setField('name', e.target.value)} 
                        className={`w-full px-3 py-2 border rounded ${getFieldError('name') ? 'border-red-500' : 'border-gray-300'}`}
                        required 
                    />
                    {getFieldError('name') && <p className="mt-1 text-xs text-red-600">{getFieldError('name')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                        type="email" 
                        value={data.email || ''} 
                        onChange={e => setField('email', e.target.value)} 
                        className={`w-full px-3 py-2 border rounded ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'}`}
                        required 
                    />
                    {getFieldError('email') && <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                    <input 
                        value={data.mobile || ''} 
                        onChange={e => setField('mobile', e.target.value)} 
                        className={`w-full px-3 py-2 border rounded ${getFieldError('mobile') ? 'border-red-500' : 'border-gray-300'}`}
                        required 
                    />
                    {getFieldError('mobile') && <p className="mt-1 text-xs text-red-600">{getFieldError('mobile')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt. Mobile</label>
                    <input 
                        value={data.alternate_mobile || ''} 
                        onChange={e => setField('alternate_mobile', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                    />
                    {getFieldError('alternate_mobile') && <p className="mt-1 text-xs text-red-600">{getFieldError('alternate_mobile')}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                    <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={e => setField('resume_file', e.target.files && e.target.files[0] ? e.target.files[0] : null)} 
                        className={`w-full ${getFieldError('resume_file') ? 'border-red-500' : ''}`} 
                    />
                    {getFieldError('resume_file') && <p className="mt-1 text-xs text-red-600">{getFieldError('resume_file')}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {skills.map(s => (
                            <span key={s} className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)} className="ml-2 text-blue-700">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            value={skillInput} 
                            onChange={e => setSkillInput(e.target.value)} 
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} 
                            className="w-full px-3 py-2 border border-gray-300 rounded" 
                            placeholder="Type skill and press Enter" 
                        />
                        <button type="button" onClick={addSkill} className="px-3 py-2 border border-gray-300 rounded">Add</button>
                    </div>
                    {getFieldError('skills') && <p className="mt-1 text-xs text-red-600">{getFieldError('skills')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                    <input 
                        type="date" 
                        value={data.dob || ''} 
                        onChange={e => setField('dob', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                    />
                    {getFieldError('dob') && <p className="mt-1 text-xs text-red-600">{getFieldError('dob')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select 
                        value={data.marital_status || ''} 
                        onChange={e => setField('marital_status', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {MARITAL_OPTIONS.map(o => (<option key={o} value={o}>{o}</option>))}
                    </select>
                    {getFieldError('marital_status') && <p className="mt-1 text-xs text-red-600">{getFieldError('marital_status')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                        value={data.gender || ''} 
                        onChange={e => setField('gender', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {GENDER_OPTIONS.map(o => (<option key={o} value={o}>{o}</option>))}
                    </select>
                    {getFieldError('gender') && <p className="mt-1 text-xs text-red-600">{getFieldError('gender')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input 
                        value={data.experience || ''} 
                        onChange={e => setField('experience', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                        placeholder='e.g. 2.5 Years, 2 Years or 0.6 Years'
                    />
                    {getFieldError('experience') && <p className="mt-1 text-xs text-red-600">{getFieldError('experience')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Timeframe</label>
                    <select 
                        value={data.joining_timeframe || ''} 
                        onChange={e => setField('joining_timeframe', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {JOINING_OPTIONS.map(o => (<option key={o} value={o}>{o}</option>))}
                    </select>
                    {data.joining_timeframe === 'Custom' && (
                        <input 
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded" 
                            placeholder="Enter custom timeframe" 
                            value={data.joining_timeframe || ''} 
                            onChange={e => setField('joining_timeframe', e.target.value)} 
                        />
                    )}
                    {getFieldError('joining_timeframe') && <p className="mt-1 text-xs text-red-600">{getFieldError('joining_timeframe')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bond Agreement</label>
                    <select 
                        value={data.bond_agreement ? 'Yes' : 'No'} 
                        onChange={e => setField('bond_agreement', e.target.value === 'Yes')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                    {getFieldError('bond_agreement') && <p className="mt-1 text-xs text-red-600">{getFieldError('bond_agreement')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input 
                        value={data.branch || ''} 
                        onChange={e => setField('branch', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                    />
                    {getFieldError('branch') && <p className="mt-1 text-xs text-red-600">{getFieldError('branch')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduate Year</label>
                    <input 
                        value={data.graduate_year || ''} 
                        onChange={e => setField('graduate_year', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                    />
                    {getFieldError('graduate_year') && <p className="mt-1 text-xs text-red-600">{getFieldError('graduate_year')}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input 
                        value={data.street_address || ''} 
                        onChange={e => setField('street_address', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded" 
                    />
                    {getFieldError('street_address') && <p className="mt-1 text-xs text-red-600">{getFieldError('street_address')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select 
                        value={countryCode} 
                        onChange={e => { 
                            const code = e.target.value; 
                            setCountryCode(code); 
                            setStateCode(''); 
                            const name = countries.find(c => c.code === code)?.name || ''; 
                            setField('country', name); 
                            setField('state', ''); 
                            setField('city', ''); 
                        }} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
                    </select>
                    {getFieldError('country') && <p className="mt-1 text-xs text-red-600">{getFieldError('country')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select 
                        value={stateCode} 
                        onChange={e => { 
                            const sc = e.target.value; 
                            setStateCode(sc); 
                            const name = states.find(s => s.isoCode === sc)?.name || ''; 
                            setField('state', name); 
                            setField('city', ''); 
                        }} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {states.map(s => (<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
                    </select>
                    {getFieldError('state') && <p className="mt-1 text-xs text-red-600">{getFieldError('state')}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select 
                        value={data.city || ''} 
                        onChange={e => setField('city', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        {cities.map(c => (<option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>))}
                    </select>
                    {getFieldError('city') && <p className="mt-1 text-xs text-red-600">{getFieldError('city')}</p>}
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                    <button type="submit" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
} 