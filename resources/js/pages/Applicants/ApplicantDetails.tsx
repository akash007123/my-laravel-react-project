import React from "react";

interface Applicant {
  id: number;
  name: string;
  email: string;
  mobile: string;
  alternate_mobile?: string | null;
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
  resume?: string | null;
}

export default function ApplicantDetails({
  applicant,
  embedded = false,
}: {
  applicant: Applicant;
  embedded?: boolean;
}) {
  const skills = (applicant.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    embedded ? (
      <>{children}</>
    ) : (
      <div className="bg-white rounded shadow overflow-hidden">{children}</div>
    );

  const resumeHref = applicant.resume
    ? applicant.resume.startsWith("http")
      ? applicant.resume
      : `/storage/${applicant.resume}`
    : null;

  return (
    <Wrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
        {/* LEFT SIDEBAR */}
        <aside className="bg-blue-900 text-white p-6 md:col-span-1 flex flex-col">
          {/* Profile Image / Initials */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-3xl uppercase">
              {applicant.name
                ? applicant.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                : "?"}
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">{applicant.name}</div>
              <div className="text-sm text-blue-200">{applicant.branch || "Applicant"}</div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>{applicant.mobile}</li>
              <li>{applicant.email}</li>
              <li>
                {[applicant.city, applicant.state, applicant.country]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </li>
            </ul>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
              Education
            </h3>
            <p className="text-sm">
              {applicant.graduate_year || "-"} <br />
              {applicant.branch || "Field of Study"}
            </p>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.length
                ? skills.map((s) => (
                    <span
                      key={s}
                      className="bg-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))
                : "-"}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="p-8 md:col-span-2">
          {/* Profile Summary */}
          {/* <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase">
              Profile
            </h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Experienced candidate seeking opportunities. This section can hold
              a brief professional summary if provided.
            </p>
          </div> */}

          {/* Work Experience */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase">
              Work Experience
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              {applicant.experience || "No experience details provided."}
            </div>
          </div>

          {/* Extra Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Joining Timeframe
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {applicant.joining_timeframe || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Bond Agreement
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {applicant.bond_agreement ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Resume Link */}
          {resumeHref && (
            <div className="mt-8">
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download Resume
              </a>
            </div>
          )}
        </section>
      </div>
    </Wrapper>
  );
}
