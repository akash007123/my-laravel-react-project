import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

type AuthUser = { name: string; email: string };

interface GalleryItem {
    id?: number | string;
    title?: string;
    image_url?: string;
    uploader?: string;
}

interface GalleryIndexProps {
    user: AuthUser;
    gallery?: GalleryItem[];
}

export default function GalleryIndex({ user, gallery = [] }: GalleryIndexProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{ title: string; image: File | null }>({
        title: '',
        image: null,
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.image) formData.append('image', data.image);
        post(route('gallery.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        } as any);
    }

    return (
        <AppLayout user={user}>
            <Head title="Gallery" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>

                {gallery.length === 0 ? (
                    <div className="text-gray-600">No items yet.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {gallery.map((item, idx) => (
                            <div key={item.id ?? idx} className="bg-white rounded-lg shadow overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title ?? 'Image'} className="w-68 h-68 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100" />
                                )}
                                <div className="p-4">
                                    {item.title && (
                                        <div className="text-sm font-medium text-gray-800">{item.title}</div>
                                    )}
                                    {item.uploader && (
                                        <div className="text-xs text-gray-500">Uploaded by {item.uploader}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="w-full"
                                    required
                                />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
} 