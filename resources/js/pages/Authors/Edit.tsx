import React from 'react';
import { Link, useForm } from '@inertiajs/react';

type Author = { id: number; author_name: string; author_profile?: string | null };

type AuthorForm = { id: number; author_name: string; author_profile: string; featured_image: File | null };

type Props = { author: Author };

export default function AuthorsEdit({ author }: Props) {
  const { data, setData, post, processing, errors, transform } = useForm<AuthorForm>({
    id: author.id,
    author_name: author.author_name || '',
    author_profile: author.author_profile || '',
    featured_image: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    transform((p) => ({ ...p, _method: 'put' }));
    post(`/authors/${data.id}`, { forceFormData: true, onFinish: () => transform((p) => ({ ...p, _method: undefined as any })) });
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Author</h1>
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
          <label className="block text-sm">Featured Image (replace)</label>
          <input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] || null)} />
        </div>
        <div>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">{processing ? 'Updating...' : 'Update'}</button>
        </div>
      </form>
    </div>
  );
} 