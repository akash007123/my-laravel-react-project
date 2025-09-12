import React from "react";
import { usePage, Link } from "@inertiajs/react";

interface Testimonial {
  id: number;
  fullname: string;
  email?: string;
  phone?: string;
  designation?: string;
  company?: string;
  message: string;
  rating: number;
  is_active: boolean;
}

export default function Show() {
  const { testimonial } = usePage<{ testimonial: Testimonial }>().props;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{testimonial.fullname}</h1>
      <p className="text-gray-600">{testimonial.designation} @ {testimonial.company}</p>
      <p className="mt-2">{testimonial.message}</p>
      <p className="mt-2 text-yellow-600">⭐ {testimonial.rating}</p>

      <Link
        href="/testimonials"
        className="mt-4 inline-block text-blue-600 underline"
      >
        Back
      </Link>
    </div>
  );
}
