import React from 'react';
import { Link, useForm } from '@inertiajs/react';

type AuthorForm = { author_name: string; author_profile: string; featured_image: File | null };

export default function AuthorsCreate() {
  const { data, setData, post, processing, errors } = useForm<AuthorForm>({
    author_name: '',
    author_profile: '',
    featured_image: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/authors', { forceFormData: true });
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create Author</h1>
        <Link href="/authors" className="text-blue-600 underline">Back</Link>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <label className="block text-sm">Name</label>
          <input value={data.author_name} onChange={e => setData('author_name', e.target.value)} className="w-full border p-2 rounded" />
          {errors.author_name && <p className="text-sm text-red-600">{errors.author_name}</p>}
        </div>
        <div>
          <label className="block text-sm">Profile</label>
          <textarea value={data.author_profile} onChange={e => setData('author_profile', e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Featured Image</label>
          <input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] || null)} />
        </div>
        <div>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">{processing ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
} 