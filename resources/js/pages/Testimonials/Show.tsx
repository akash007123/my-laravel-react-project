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
    <>
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 mt-4 mb-4">
          <h2 className="mb-5 text-center text-lg font-bold">Thanks for your feedback &#128519;</h2>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{testimonial.fullname}</h1>
          <p className="text-gray-500 text-sm mb-4">
            {testimonial.designation} @ {testimonial.company}
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {testimonial.message}
          </p>

          <p className="text-yellow-500 text-xl mb-6">
            {'⭐'.repeat(testimonial.rating)}
          </p>

          <Link href="/layout" className="inline-block">
            <span className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
              ← Back
            </span>
          </Link>
        </div>
      </div>
    </>

  );
}
