import React from 'react';
import { Link } from '@inertiajs/react';

type Author = { id: number; author_name: string; author_profile?: string | null };

type Props = { authors: Author[] };

export default function AuthorsIndex({ authors }: Props) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link href="/authors/create" className="px-3 py-2 bg-blue-600 text-white rounded">Create Author</Link>
      </div>
      <div className="grid gap-2">
        {authors.map(a => (
          <div key={a.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{a.author_name}</div>
              {a.author_profile && <div className="text-sm text-gray-600">{a.author_profile}</div>}
            </div>
            <Link href={`/authors/${a.id}/edit`} className="text-blue-700 underline">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 