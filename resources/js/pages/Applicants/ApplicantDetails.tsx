import React from 'react';

interface Applicant {
    id: number; name: string; email: string; mobile: string; alternate_mobile?: string | null; skills?: string | null;
    dob?: string | null; marital_status?: string | null; gender?: string | null; experience?: string | null; joining_timeframe?: string | null;
    bond_agreement?: boolean; branch?: string | null; graduate_year?: string | null; street_address?: string | null; country?: string | null; state?: string | null; city?: string | null;
    resume?: string | null;
}

export default function ApplicantDetails({ applicant, embedded = false }: { applicant: Applicant; embedded?: boolean }) {
    const skills = (applicant.skills || '').split(',').map(s=>s.trim()).filter(Boolean);

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        embedded ? <>{children}</> : <div className="bg-white rounded shadow overflow-hidden">{children}</div>
    );

    const resumeHref = applicant.resume ? (applicant.resume.startsWith('http') ? applicant.resume : `/storage/${applicant.resume}`) : null;

    return (
        <Wrapper>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <aside className="bg-gray-50 p-6 md:col-span-1 border-r">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">{(applicant.name || '?').slice(0,1)}</div>
                        <div>
                            <div className="text-lg font-semibold text-gray-900">{applicant.name}</div>
                            <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div><span className="font-medium text-gray-700">Mobile:</span> <span className="text-gray-600">{applicant.mobile}</span></div>
                        <div><span className="font-medium text-gray-700">Alt. Mobile:</span> <span className="text-gray-600">{applicant.alternate_mobile || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">Location:</span> <span className="text-gray-600">{[applicant.city, applicant.state, applicant.country].filter(Boolean).join(', ') || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-600">{applicant.street_address || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">DOB:</span> <span className="text-gray-600">{applicant.dob || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">Marital Status:</span> <span className="text-gray-600">{applicant.marital_status || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">Gender:</span> <span className="text-gray-600">{applicant.gender || '-'}</span></div>
                        <div><span className="font-medium text-gray-700">Graduate Year:</span> <span className="text-gray-600">{applicant.graduate_year || '-'}</span></div>
                        <div>
                            <span className="font-medium text-gray-700">Resume:</span>{' '}
                            {resumeHref ? (
                                <a href={resumeHref} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center mt-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Download Resume
                                </a>
                            ) : (
                                <span className="text-gray-600">-</span>
                            )}
                        </div>
                    </div>
                </aside>
                <section className="p-6 md:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                        <p className="mt-2 text-gray-600 text-sm">Experienced candidate seeking opportunities. This section can hold a brief professional summary if provided.</p>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {skills.length ? skills.map(s => (
                                <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
                            )) : <span className="text-sm text-gray-500">-</span>}
                        </div>
                    </div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Experience</h3>
                            <p className="mt-2 text-sm text-gray-600">{applicant.experience || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Joining Timeframe</h3>
                            <p className="mt-2 text-sm text-gray-600">{applicant.joining_timeframe || '-'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Bond Agreement</h3>
                            <p className="mt-2 text-sm text-gray-600">{applicant.bond_agreement ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Branch</h3>
                            <p className="mt-2 text-sm text-gray-600">{applicant.branch || '-'}</p>
                        </div>
                    </div>
                </section>
            </div>
        </Wrapper>
    );
} 