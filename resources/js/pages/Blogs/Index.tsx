import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Trash2, Pencil, Eye } from 'lucide-react'

type BlogListItem = {
    id: number;
    title: string;
    slug: string;
    status: string;
    author?: string | null;
    author_image_url?: string | null;
    category?: string | null;
    featured_image_url?: string | null;
    tags?: string[];
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = { blogs: Pagination<BlogListItem> };

export default function BlogsIndex({ blogs }: Props) {
    function showDeleteConfirmation(b: BlogListItem) {
        if (!confirm('Delete this blog?')) return;
        router.delete(`/blogs/${b.id}`);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Blogs</h1>
                <Link href="/blogs/create" className="px-3 py-2 bg-blue-600 text-white rounded">Create Blog</Link>
            </div>

            <div className="overflow-x-auto rounded border">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Author</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {blogs.data.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        {b.author_image_url && (
                                            <img src={b.author_image_url} alt={b.author || ''} className="w-8 h-8 rounded-full object-cover" />
                                        )}
                                        <span className="text-sm text-gray-800">{b.author || '—'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="text-sm font-medium text-gray-900">{b.title}</div>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">{b.category || '—'}</td>
                                <td className="px-4 py-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-end items-center gap-2">
                                        <Link href={`/blogs/${b.id}`} className="flex items-center px-3 py-1.5 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200">
                                            <Eye className='w-4 h-4' />
                                        </Link>
                                        <Link href={`/blogs/${b.id}/edit`} className="flex items-center px-3 py-1.5 text-xs text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200">
                                            <Pencil className='w-4 h-4' />
                                        </Link>
                                        <button onClick={() => showDeleteConfirmation(b)} className="flex items-center px-3 py-1.5 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200">
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 