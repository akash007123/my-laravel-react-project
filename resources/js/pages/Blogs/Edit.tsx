import React from 'react';
import { Link, useForm } from '@inertiajs/react';

type Option = { id: number; name: string };

type SectionInput = { id?: number; heading: string; content: string; image: File | null; image_url: string; _delete?: boolean };

type BlogEditForm = {
  id: number;
  author_id: number | string;
  category_id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  featured_image: File | null;
  tag_ids: number[];
  sections: SectionInput[];
};

type Props = {
  blog: any;
  authors: Option[];
  categories: Option[];
  tags: Option[];
};

export default function BlogsEdit({ blog, authors, categories, tags }: Props) {
  const initial: BlogEditForm = {
    id: blog.id,
    author_id: blog.author_id || blog.author?.id || '',
    category_id: blog.category_id || blog.category?.id || '',
    title: blog.title || '',
    slug: blog.slug || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    status: blog.status || 'draft',
    featured_image: null,
    tag_ids: (blog.tags || []).map((t: any) => t.id),
    sections: (blog.sections || []).map((s: any) => ({ id: s.id, heading: s.heading || '', content: s.content || '', image: null, image_url: s.image_url || '' })),
  };

  const { data, setData, post, processing, errors, transform } = useForm<BlogEditForm>(initial);

  const addSection = () => setData('sections', [...data.sections, { heading: '', content: '', image: null, image_url: '' }]);
  const markRemoveSection = (idx: number) => {
    const copy = [...data.sections];
    if (copy[idx].id) copy[idx]._delete = true; else copy.splice(idx, 1);
    setData('sections', copy);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    transform((payload) => ({ ...payload, _method: 'put' }));
    post(`/blogs/${data.id}`, { forceFormData: true, onFinish: () => transform((p) => ({ ...p, _method: undefined as any })) });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <Link href="/blogs" className="text-blue-600 underline">Back</Link>
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Author</label>
            <select value={data.author_id} onChange={e => setData('author_id', e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select Author</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Category</label>
            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm">Title</label>
          <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Excerpt</label>
          <textarea value={data.excerpt} onChange={e => setData('excerpt', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Content</label>
          <textarea value={data.content} onChange={e => setData('content', e.target.value)} className="w-full border p-2 rounded" rows={6} />
        </div>

        <div>
          <label className="block text-sm">Featured Image (replace)</label>
          <input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="block text-sm">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <label key={t.id} className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={data.tag_ids.includes(t.id)}
                  onChange={e => {
                    const next = e.target.checked ? [...data.tag_ids, t.id] : data.tag_ids.filter((id) => id !== t.id);
                    setData('tag_ids', next);
                  }}
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Sections</label>
            <button type="button" onClick={addSection} className="px-2 py-1 text-sm bg-gray-100 rounded">Add section</button>
          </div>
          <div className="grid gap-3 mt-2">
            {data.sections.map((s, idx) => (
              <div key={idx} className={`border rounded p-3 grid gap-2 ${s._delete ? 'opacity-50' : ''}`}>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Heading" value={s.heading} onChange={e => {
                    const copy = [...data.sections]; copy[idx].heading = e.target.value; setData('sections', copy);
                  }} className="border p-2 rounded" />
                  <input placeholder="Image URL (optional)" value={s.image_url} onChange={e => {
                    const copy = [...data.sections]; copy[idx].image_url = e.target.value; setData('sections', copy);
                  }} className="border p-2 rounded" />
                </div>
                <textarea placeholder="Content" value={s.content} onChange={e => {
                  const copy = [...data.sections]; copy[idx].content = e.target.value; setData('sections', copy);
                }} className="border p-2 rounded" rows={4} />
                <div>
                  <input type="file" accept="image/*" onChange={e => {
                    const copy = [...data.sections]; copy[idx].image = e.target.files?.[0] || null; setData('sections', copy);
                  }} />
                </div>
                <div className="flex justify-between items-center">
                  <select value={data.status} onChange={e => setData('status', e.target.value as BlogEditForm['status'])} className="border p-2 rounded">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <button type="button" onClick={() => markRemoveSection(idx)} className="text-red-600 text-sm">{s._delete ? 'Marked' : 'Remove'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">
            {processing ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
} 