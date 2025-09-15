import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Calendar, Clock, Eye, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { formatDateOnly } from "../utils";


type Section = {
  id: number;
  heading?: string;
  content?: string;
  image_url?: string | null;
};

type BlogView = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status: string;
  featured_image_url?: string | null;
  author_image_url?: string | null;
  author?: { id: number; author_name: string; avatar?: string | null } | null;
  category?: { id: number; name: string } | null;
  tags: { id: number; name: string }[];
  sections: Section[];
  created_at?: string;
  read_time?: string;
  views?: number;
};

type RelatedCard = { id: number; title: string; featured_image_url?: string | null; author?: string | null; created_at?: string;  author_image_url?: string | null; };

type Props = { blog: BlogView; related?: RelatedCard[] };

export default function BlogsShow({ blog, related = [] }: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  const pageUrl = (typeof window !== 'undefined' ? window.location.origin : '') + `/blogs/${blog.id}`;
  const shareText = `${blog.title}`;

  async function handleNativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: blog.title, text: shareText, url: pageUrl });
        return;
      }
    } catch {}
    setShareOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setShareOpen(false);
      alert('Link copied to clipboard');
    } catch {
      const tmp = document.createElement('input');
      tmp.value = pageUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      setShareOpen(false);
      alert('Link copied to clipboard');
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero section */}
      <div className="relative bg-black text-white">
        {blog.featured_image_url && (
          <img
            src={blog.featured_image_url}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Category + Meta */}
          <div className="flex items-center gap-4 text-sm mb-4">
            {blog.category && (
              <span className="bg-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                {blog.category.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {blog.read_time || "1 min read"}
            </span>
            {blog.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {blog.views} views
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-4 text-lg max-w-2xl text-gray-200">{blog.excerpt}</p>
          )}
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <Link
          href="/blogs/blogcardpage"
          className="flex items-center text-gray-600 dark:text-gray-300 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main column */}
          <div className="md:col-span-8">
            {/* Author card */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                {blog.author_image_url && (
                  <img
                    src={blog.author_image_url}
                    alt={blog.author?.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {blog.author?.author_name}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDateOnly(blog.created_at || "Unknown date")} · {blog.read_time || "1 min read"}
                  </div>
                </div>
              </div>

              <div className="relative flex gap-3">
                <button className="p-2 cursor-pointer rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button onClick={handleNativeShare} className="p-2 cursor-pointer rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                {shareOpen && (
                  <div className="absolute right-0 top-10 z-20 w-56 rounded-md border bg-white p-2 shadow-lg dark:bg-gray-800">
                    <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">Share</div>
                    <div className="flex flex-col gap-1">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >
                       WhatsApp <i className="fa fa-whatsapp"></i>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >X / Twitter</a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >Facebook</a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(shareText)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >LinkedIn</a>
                      <button onClick={copyLink} className="text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Copy link</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            {blog.content && (
              <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            )}

            {/* Sections */}
            <div className="grid gap-8">
              {blog.sections.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
                >
                  {s.heading && (
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {s.heading}
                    </h3>
                  )}
                  {s.image_url && (
                    <img
                      src={s.image_url}
                      alt={s.heading || ""}
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  {s.content && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {s.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-sm rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 border border-4 border-gray-100 p-4 rounded-lg shadow-lg">
            <div className="sticky top-20">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Articles</h2>
              {related.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Related blog not available.</div>
              ) : (
                <div className="grid gap-3">
                  {related.map(r => (
                    <Link key={r.id} href={`/blogs/${r.id}`} className="flex gap-3 items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="w-20 h-14 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
                        {r.featured_image_url ? (
                          <img src={r.featured_image_url} alt={r.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500">No Image</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{r.title}</div>
                        <div className="text-xs text-gray-500">{r.author}</div>
                        <div className="text-xs text-gray-500">{formatDateOnly(r.created_at || '')}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
