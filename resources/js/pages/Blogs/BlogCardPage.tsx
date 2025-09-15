import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from "framer-motion";
import { formatDateOnly } from '../utils'

type BlogCard = {
    id: number;
    title: string;
    excerpt?: string | null;
    featured_image_url?: string | null;
    author?: string | null;
    author_image_url?: string | null;
    category?: string | null;
    status: string;
    created_at: string;
    tags?: { id: number; name: string }[];
};

type CategoryOption = { id: number; name: string };

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = { blogs: Pagination<BlogCard>; filters?: { category_id?: string | number | null; q?: string | null }; categories?: CategoryOption[] };

export default function BlogCardPage({ blogs, filters, categories = [] }: Props) {
    const page = usePage();
    const categoryId = (filters?.category_id ?? '') as string | number | '';
    const q = filters?.q || '';

    function applyFilters(next: { category_id?: string | number; q?: string; page?: number }) {
        const params = new URLSearchParams();
        const cid = next.category_id !== undefined ? String(next.category_id) : String(categoryId || '');
        if (cid) params.set('category_id', cid);
        const nq = next.q !== undefined ? next.q : q;
        if (nq) params.set('q', nq);
        if (next.page) params.set('page', String(next.page));
        router.get('/blogs/blogcardpage', Object.fromEntries(params.entries()), { preserveScroll: true, preserveState: true });
    }

    return (
        <>

            <div className="relative overflow-hidden bg-white py-24">

                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className="absolute w-[50vw] h-[50vw] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-40"
                        initial={{ x: "-50%", y: "-50%", scale: 0.8 }}
                        animate={{ x: "-40%", y: "-40%", scale: 1 }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-[40vw] h-[40vw] bg-gradient-to-r from-pink-400 to-yellow-300 rounded-full blur-2xl opacity-30 bottom-0 right-0"
                        initial={{ x: "30%", y: "30%", scale: 1 }}
                        animate={{ x: "40%", y: "40%", scale: 1.1 }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                        }}
                    />

                    <div className="absolute inset-0 overflow-hidden z-0">
                        {[...Array(10)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute bottom-0 w-3 h-3 bg-blue-300 rounded-full opacity-30 blur-md"
                                initial={{
                                    x: `${Math.random() * 100}%`,
                                    y: "100%",
                                    scale: Math.random() * 1.2 + 0.3,
                                }}
                                animate={{
                                    y: "-10%",
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 10,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">

                    <motion.h1
                        className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Discover Stories, Ideas & Inspiration
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-gray-600 mb-8"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Welcome to our blog – a place where we share insights, tutorials, and behind-the-scenes content from our team.
                    </motion.p>
                    <div className="mx-auto max-w-3xl mt-6 shadow-2xl p-10">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Category</label>
                                <select
                                    value={String(categoryId || '')}
                                    onChange={(e) => applyFilters({ category_id: e.target.value || undefined, page: 1 })}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="">All</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    defaultValue={q || ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            applyFilters({ q: (e.target as HTMLInputElement).value, page: 1 });
                                        }
                                    }}
                                    placeholder="Search by title or author..."
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <button
                                onClick={() => applyFilters({ q: '', category_id: '' as any, page: 1 })}
                                className="px-3 py-2 text-sm border rounded"
                            >Clear</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.data.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 border"
                        >
                            {b.featured_image_url ? (
                                <img
                                    src={b.featured_image_url}
                                    alt={b.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm italic">
                                    No Image Available
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{b.title}</h2>

                                {b.excerpt && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{b.excerpt}</p>
                                )}

                                {b.tags && b.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {b.tags.map(tag => (
                                            <span key={tag.id} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">#{tag.name}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                    <div className="flex items-center gap-2">
                                        {b.author_image_url && (
                                            <img
                                                src={b.author_image_url}
                                                alt="Author"
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        )}
                                        <span>
                                            <div className='ml-[5px]'>
                                                {b.author || '—'}
                                            </div>
                                            {b.category ? ` · ${b.category}` : ''}
                                        </span>
                                    </div>
                                    <div>{formatDateOnly(b.created_at)}</div>
                                </div>

                                <Link
                                    href={`/blogs/${b.id}`}
                                    className="inline-block text-blue-600 font-medium hover:underline hover:text-blue-800 text-sm"
                                >
                                    Read More →
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8 gap-2">
                    {blogs.links.filter(l => l.url !== null).map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => applyFilters({ page: Number(new URL(link.url as string).searchParams.get('page') || 1) })}
                            className={`px-3 py-1.5 text-sm rounded border ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

        </>
    );
} 