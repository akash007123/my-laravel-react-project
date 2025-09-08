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

  const address = [applicant.city, applicant.state, applicant.country]
    .filter((v) => !!v && String(v).trim() !== "")
    .join(", ");

  const contactItems = [
    applicant.mobile && String(applicant.mobile).trim() !== "" ? applicant.mobile : null,
    applicant.email && String(applicant.email).trim() !== "" ? applicant.email : null,
    address && address.trim() !== "" ? address : null,
  ].filter(Boolean) as string[];

  const hasEducation = !!(
    (applicant.graduate_year && String(applicant.graduate_year).trim() !== "") ||
    (applicant.branch && String(applicant.branch).trim() !== "")
  );

  const hasExperience = !!(applicant.experience && String(applicant.experience).trim() !== "");

  const extraInfoItems: { label: string; value: string }[] = [];
  if (applicant.joining_timeframe && String(applicant.joining_timeframe).trim() !== "") {
    extraInfoItems.push({ label: "Joining Timeframe", value: String(applicant.joining_timeframe) });
  }
  if (typeof applicant.bond_agreement === "boolean") {
    extraInfoItems.push({ label: "Bond Agreement", value: applicant.bond_agreement ? "Yes" : "No" });
  }

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
          {contactItems.length > 0 && (
            <div className="mb-6">
              <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
                Contact
              </h3>
              <ul className="space-y-2 text-sm">
                {contactItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {hasEducation && (
            <div className="mb-6">
              <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
                Education
              </h3>
              <p className="text-sm">
                {applicant.graduate_year}
                {applicant.graduate_year && applicant.branch ? <br /> : null}
                {applicant.branch}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="uppercase text-sm font-semibold border-b border-blue-700 pb-1 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-700 px-2 py-1 rounded text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <section className="p-8 md:col-span-2">
          {/* Work Experience */}
          {hasExperience && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 uppercase">
                Work Experience
              </h2>
              <div className="mt-2 text-sm text-gray-600">
                {applicant.experience} Years
              </div>
            </div>
          )}

          {/* Extra Info */}
          {extraInfoItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extraInfoItems.map((it) => (
                <div key={it.label}>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase">
                    {it.label}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {it.value}
                  </p>
                </div>
              ))}
            </div>
          )}

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
