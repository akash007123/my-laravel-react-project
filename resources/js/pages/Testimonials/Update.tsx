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
    e.preventDefault();
    put(`/testimonials/${testimonial.id}`);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          value={data.fullname}
          onChange={(e) => setData("fullname", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}

        <input
          type="email"
          placeholder="Email (optional)"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="text"
          placeholder="Phone (optional)"
          value={data.phone}
          onChange={(e) => setData("phone", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}

        <input
          type="text"
          placeholder="Designation (optional)"
          value={data.designation}
          onChange={(e) => setData("designation", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.designation && <p className="text-red-500">{errors.designation}</p>}

        <input
          type="text"
          placeholder="Company (optional)"
          value={data.company}
          onChange={(e) => setData("company", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.company && <p className="text-red-500">{errors.company}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setData("profile", e.target.files ? e.target.files[0] : null)}
            className="w-full border p-2 rounded"
          />
          {errors.profile && <p className="text-red-500">{errors.profile}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={data.rating}
            onChange={(e) => setData("rating", Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
          {errors.rating && <p className="text-red-500">{errors.rating}</p>}
        </div>

        <textarea
          value={data.message}
          onChange={(e) => setData("message", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.message && <p className="text-red-500">{errors.message}</p>}

        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.is_active}
            onChange={(e) => setData("is_active", e.target.checked)}
          />
          <span>Active</span>
        </label>
        {errors.is_active && <p className="text-red-500">{errors.is_active}</p>}

        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {processing ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
