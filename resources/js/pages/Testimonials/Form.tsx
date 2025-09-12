import React from "react";
import { useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        fullname: "",
        email: "",
        phone: "",
        designation: "",
        company: "",
        message: "",
        rating: 5,
        profile: null as File | null,
        is_active: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post("/testimonials", {
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Share you feedback with us.
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Full Name */}
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={data.fullname}
                                onChange={(e) => setData("fullname", e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.fullname && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Phone */}
                        <div>
                            <input
                                type="text"
                                placeholder="Phone"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>

                        {/* Designation */}
                        <div>
                            <input
                                type="text"
                                placeholder="Designation"
                                value={data.designation}
                                onChange={(e) => setData("designation", e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.designation && (
                                <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
                            )}
                        </div>
                    </div>


                    <div className="grid">
                        {/* Company */}
                        <div>
                            <input
                                type="text"
                                placeholder="Company"
                                value={data.company}
                                onChange={(e) => setData("company", e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.company && (
                                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Image (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("profile", e.target.files ? e.target.files[0] : null)
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.profile && (
                                <p className="text-red-500 text-sm mt-1">{errors.profile}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating (Select you preferance)
                            </label>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const index = i + 1;
                                    const active = index <= (data.rating || 0);
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            aria-label={`Rate ${index} star${index > 1 ? 's' : ''}`}
                                            onClick={() => setData("rating", index)}
                                            className="p-1"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill={active ? "#FACC15" : "#E5E7EB"}
                                                className="w-7 h-7"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.rating && (
                                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <textarea
                            placeholder="Message"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition duration-200 disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Save Testimonial"}
                    </button>
                </form>
            </div>
        </div>
    );
}
