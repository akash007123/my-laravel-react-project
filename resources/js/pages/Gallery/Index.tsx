import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X, Edit2, Trash2, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

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
    const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [galleryToDelete, setGalleryToDelete] = useState<GalleryItem | null>(null);

    function handleDelete(item: GalleryItem) {
        setGalleryToDelete(item);
        setShowDeleteModal(true);
    }

    function confirmDelete() {
        if (galleryToDelete && galleryToDelete.id) {
            router.post(route('gallery.destroy', galleryToDelete.id as any), { _method: 'delete' }, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setGalleryToDelete(null);
                },
            } as any);
        }
    }

    const { data, setData, post, processing, errors, reset } = useForm<{ title: string; image: File | null }>({
        title: '',
        image: null,
    });

    function openCreateModal() {
        setOpen(true);
        setEditMode(false);
        reset();
    }

    function openEditModal(item: GalleryItem) {
        setData({
            title: item.title || '',
            image: null,
        });
        setPreviewItem(item);
        setEditMode(true);
        setOpen(true);
    }

    function openPreviewModal(item: GalleryItem) {
        setPreviewItem(item);
    }

    function closeModal() {
        setOpen(false);
        setPreviewItem(null);
        setEditMode(false);
        reset();
        setIsSubmitting(false);
    }

    function clearBrowserCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            }).catch(error => {
                console.warn('Cache clearing failed:', error);
            });
        }
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title || '');

        if (data.image) {
            formData.append('image', data.image);
        }

        const handleSuccess = () => {
            closeModal();
            clearBrowserCache();
            if (!editMode) {
                window.location.reload();
            }
        };

        const handleError = (errors: any) => {
            setIsSubmitting(false);
            console.error('Form submission failed:', errors);
        };

        if (editMode && previewItem?.id) {
            formData.append('_method', 'PUT');

            router.post(route('gallery.update', previewItem.id), formData, {
                forceFormData: true,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        } else {
            router.post(route('gallery.store'), formData, {
                forceFormData: true,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        }
    }

    return (
        <AppLayout user={user}>
            <Head title="Gallery" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
                    <button
                        onClick={openCreateModal}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>

                {gallery.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                        <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No gallery items yet.</p>
                        <p className="text-sm mt-2">Click the "Add" button to upload your first image.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {gallery.map((item, idx) => (
                            <div key={item.id ?? idx} className="bg-white rounded-lg shadow overflow-hidden group">
                                {item.image_url ? (
                                    <div className="relative">
                                        <img
                                            src={item.image_url}
                                            alt={item.title ?? 'Image'}
                                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => openPreviewModal(item)}
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="cursor-pointer bg-black/50 text-white p-2 rounded-full"
                                                aria-label="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="cursor-pointer bg-black/50 text-white p-2 rounded-full"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* <div className="social flex mt-4 ">
                                            <div className='cursor-pointer text-blue-800 hover:bg-blue-800 hover:text-white p-2 rounded-full'>
                                                <Facebook className="w-5 h-5" />
                                            </div>
                                            <div className='cursor-pointer text-pink-800 hover:bg-pink-800 hover:text-white p-2 rounded-full'>
                                                <Instagram className="w-5 h-5" />
                                            </div>
                                            <div className='cursor-pointer text-sky-800 hover:bg-sky-800 hover:text-white p-2 rounded-full'>
                                                <Twitter className="w-5 h-5" />
                                            </div>
                                            <div className='cursor-pointer text-red-800 hover:bg-red-800 hover:text-white p-2 rounded-full'>
                                                <Mail className="w-5 h-5" />
                                            </div>
                                        </div> */}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    {item.title && (
                                        <div className="text-sm font-medium text-gray-800 mb-1">{item.title}</div>
                                    )}
                                    {item.uploader && (
                                        <div className="text-xs text-gray-500"><b>Uploaded by</b> &nbsp;
                                            <span className="text-blue-500"><strong>&#10170; &nbsp;{item.uploader}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">
                            {editMode ? 'Edit Image' : 'Upload Image'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={processing || isSubmitting}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image {editMode ? '' : '*'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required={!editMode}
                                    disabled={processing || isSubmitting}
                                />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                {editMode && (
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                    disabled={processing || isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || isSubmitting}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                >
                                    {(processing || isSubmitting) ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            {editMode ? 'Updating...' : 'Uploading...'}
                                        </>
                                    ) : (
                                        editMode ? 'Update' : 'Upload'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewItem && !open && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden relative">
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="cursor-pointer absolute top-3 right-3 text-white bg-black/20 hover:bg-black/40 rounded-full p-2 z-10"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => openEditModal(previewItem)}
                            className="cursor-pointer absolute top-3 right-16 text-white bg-black/20 hover:bg-black/40 rounded-full p-2 z-10"
                            aria-label="Edit"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>

                        {previewItem.image_url && (
                            <img
                                src={previewItem.image_url}
                                alt={previewItem.title ?? 'Image'}
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        )}

                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{previewItem.title}</h3>
                            {previewItem.uploader && (
                                <p className="text-gray-600">Uploaded by {previewItem.uploader}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteModal && galleryToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Delete Image</h3>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete "{galleryToDelete.title || 'Untitled'}"?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setGalleryToDelete(null); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                            <button onClick={confirmDelete} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}