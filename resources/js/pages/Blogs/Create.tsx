import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

type Option = { id: number; name: string };

type SectionInput = { heading: string; content: string; image: File | null; image_url: string };

type BlogCreateForm = {
  author_id: string | number;
  author_name?: string;
  author_image?: File | null;
  category_id: string | number;
  category_name?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  featured_image: File | null;
  tag_ids: number[];
  tag_names?: string[];
  sections: SectionInput[];
};

type Props = {
  authors: Option[];
  categories: Option[];
  tags: Option[];
};

export default function BlogsCreate({ authors, categories, tags }: Props) {
  const [addNewAuthor, setAddNewAuthor] = useState(false);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { data, setData, post, processing, errors } = useForm<BlogCreateForm>({
    author_id: '',
    author_name: '',
    author_image: null,
    category_id: '',
    category_name: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured_image: null,
    tag_ids: [],
    tag_names: [],
    sections: [],
  });

  const addSection = () => setData('sections', [...data.sections, { heading: '', content: '', image: null, image_url: '' }]);
  const removeSection = (idx: number) => setData('sections', data.sections.filter((_: any, i: number) => i !== idx));

  function addTagFromInput() {
    const parts = tagInput.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const next = Array.from(new Set([...(data.tag_names || []), ...parts]));
    setData('tag_names', next);
    setTagInput('');
  }
  function removeNewTag(name: string) {
    setData('tag_names', (data.tag_names || []).filter(t => t !== name));
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/blogs', { forceFormData: true });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Blog</h1>
        <Link href="/blogs" className="text-blue-600 underline">Back</Link>
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm">Author</label>
              <label className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={addNewAuthor} onChange={(e) => setAddNewAuthor(e.target.checked)} />
                <span>Add new</span>
              </label>
            </div>
            {!addNewAuthor ? (
              <>
                <select value={data.author_id} onChange={e => setData('author_id', e.target.value)} className="w-full border p-2 rounded">
                  <option value="">Select Author</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {errors.author_id && <p className="text-sm text-red-600">{errors.author_id}</p>}
              </>
            ) : (
              <div className="grid gap-2">
                <input placeholder="Author name" value={data.author_name} onChange={e => setData('author_name', e.target.value)} className="w-full border p-2 rounded" />
                <input type="file" accept="image/*" onChange={e => setData('author_image', e.target.files?.[0] || null)} />
                {errors.author_name && <p className="text-sm text-red-600">{errors.author_name}</p>}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm">Category</label>
              <label className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={addNewCategory} onChange={(e) => setAddNewCategory(e.target.checked)} />
                <span>Add new</span>
              </label>
            </div>
            {!addNewCategory ? (
              <>
                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full border p-2 rounded">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
              </>
            ) : (
              <div className="grid gap-2">
                <input placeholder="Category name" value={data.category_name} onChange={e => setData('category_name', e.target.value)} className="w-full border p-2 rounded" />
                {errors.category_name && <p className="text-sm text-red-600">{errors.category_name}</p>}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm">Title</label>
          <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border p-2 rounded" />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
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
          <label className="block text-sm">Featured Image</label>
          <input type="file" accept="image/*" onChange={e => setData('featured_image', e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="block text-sm">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
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
          <div className="mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTagFromInput(); } }}
                placeholder="Add custom tags (comma separated)"
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button type="button" onClick={addTagFromInput} className="px-3 py-2 text-sm border rounded">Add</button>
            </div>
            {errors.tag_names && <p className="text-sm text-red-600 mt-1">{errors.tag_names as any}</p>}
            {(data.tag_names || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(data.tag_names || []).map((name) => (
                  <span key={name} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {name}
                    <button type="button" onClick={() => removeNewTag(name)} className="ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Sections</label>
            <button type="button" onClick={addSection} className="px-2 py-1 text-sm bg-gray-100 rounded">Add section</button>
          </div>
          <div className="grid gap-3 mt-2">
            {data.sections.map((s, idx) => (
              <div key={idx} className="border rounded p-3 grid gap-2">
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
                  <select value={data.status} onChange={e => setData('status', e.target.value as BlogCreateForm['status'])} className="border p-2 rounded">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <button type="button" onClick={() => removeSection(idx)} className="text-red-600 text-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">
            {processing ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 