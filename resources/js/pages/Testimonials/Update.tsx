import React from "react";
import { useForm, usePage } from "@inertiajs/react";

interface Testimonial {
  id: number;
  fullname: string;
  email?: string;
  phone?: string;
  designation?: string;
  company?: string;
  message: string;
  rating: number;
  profile?: string;
  is_active?: boolean;
}

export default function Update() {
  const { testimonial } = usePage<{ testimonial: Testimonial }>().props;

  const { data, setData, put, processing, errors } = useForm({
    fullname: testimonial.fullname || "",
    email: testimonial.email || "",
    phone: testimonial.phone || "",
    designation: testimonial.designation || "",
    company: testimonial.company || "",
    message: testimonial.message || "",
    rating: testimonial.rating || 5,
    profile: null as File | null,
    is_active: testimonial.is_active ?? true,
  });

  function handleSubmit(e: React.FormEvent) {
    console.log(data,"data receive")
    e.preventDefault();
    put(`/testimonials/${testimonial.id}`);
  }

  return (
    <div className=" justify-center flex">

      <form onSubmit={handleSubmit} className="w-full p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <div className="shadow-2xl p-4 rounded-2xl">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="fullname"
              type="text"
              value={data.fullname}
              onChange={(e) => setData("fullname", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>}
          </div>

          {/* Email */}
          <div className="shadow-2xl p-4 rounded-2xl">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email (optional)"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="shadow-2xl p-4 rounded-2xl">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              id="phone"
              type="text"
              placeholder="Phone (optional)"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Designation */}
          <div className="shadow-2xl p-4 rounded-2xl">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              id="designation"
              type="text"
              placeholder="Designation (optional)"
              value={data.designation}
              onChange={(e) => setData("designation", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.designation && <p className="text-sm text-red-500 mt-1">{errors.designation}</p>}
          </div>

          {/* Company */}
          <div className="shadow-2xl p-4 rounded-2xl">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              id="company"
              type="text"
              placeholder="Company (optional)"
              value={data.company}
              onChange={(e) => setData("company", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
          </div>

          {/* Rating */}
            <div className="shadow-2xl p-4 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const index = i + 1;
                  const active = index <= (data.rating || 0);
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setData("rating", index)}
                      className="p-0.5"
                    >
                      <svg
                        className="w-5 h-5"
                        fill={active ? "#FACC15" : "#E5E7EB"}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
              <small className="text-gray-400">Select on star for rating</small>
            </div>

          {/* Profile Image */}
          <div className="md:col-span-2 shadow-2xl p-6">
            <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-1">Profile Image (optional)</label>
            <input
              id="profile"
              type="file"
              accept="image/*"
              onChange={(e) => setData("profile", e.target.files ? e.target.files[0] : null)}
              className="w-full border border-gray-300 p-2 rounded bg-white shadow-sm focus:outline-none"
            />
            {errors.profile && <p className="text-sm text-red-500 mt-1">{errors.profile}</p>}
          </div>

          {/* Message */}
          <div className="md:col-span-2 shadow-2xl p-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              value={data.message}
              onChange={(e) => setData("message", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2 shadow-2xl mb-4">
            <input
              id="is_active"
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => setData("is_active", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 cursor-pointer p-2 rounded-lg">Active</label>
            {errors.is_active && <p className="text-sm text-red-500 mt-1">{errors.is_active}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>

  );
}
