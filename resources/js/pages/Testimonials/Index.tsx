import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

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
  profile?: string | null;
}

export default function Index() {
  const { testimonials } = usePage<{ testimonials: Testimonial[] }>().props;

  function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    router.delete(`/testimonials/${id}`);
  }

  function resolveImageUrl(path?: string | null) {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
    return `/storage/${path}`;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Testimonials</h1>
      <Link
        href="/testimonials/create"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Testimonial
      </Link>

      <div className="mt-6 space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="border p-4 rounded shadow-sm flex justify-between"
          >
            <div className="flex items-start gap-4">
              {resolveImageUrl(t.profile) && (
                <img
                  src={resolveImageUrl(t.profile) as string}
                  alt={t.fullname}
                  className="w-14 h-14 rounded-full object-cover border"
                />
              )}
            <div>
              <h2 className="font-semibold text-lg">{t.fullname}</h2>
              <p className="text-gray-600">{t.designation} @ {t.company}</p>
              <p>{t.message}</p>
              <p className="text-yellow-600">⭐ {t.rating}</p>
              </div>
            </div>
            <div className="space-x-2">
              <Link
                href={`/testimonials/${t.id}`}
                className="text-blue-600 underline"
              >
                View
              </Link>
              <Link
                href={`/testimonials/${t.id}/edit`
                }
                className="text-green-600 underline"
              >
                Edit
              </Link>
              <button onClick={() => handleDelete(t.id)} className="text-red-600 underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
