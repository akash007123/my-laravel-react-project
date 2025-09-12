import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export type Tab = 'git' | 'excel' | 'codebase';

export interface LinkItem {
    id: number;
    type: Tab;
    title: string;
    url?: string | null;
    file_path?: string | null;
}

export default function LinkForm({ type, initial, onCompleted }: { type: Tab; initial?: Partial<LinkItem>; onCompleted?: () => void }) {
    const [form, setForm] = useState<{ id: number; title: string; url: string; file: File | null }>({ id: Number(initial?.id || 0), title: initial?.title || '', url: (initial?.url as string) || '', file: null });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => { setForm({ id: 0, title: '', url: '', file: null }); setErrors({}); };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (type === 'git') {
            if (!form.url?.trim()) e.url = 'URL is required for Git';
        } else {
            if (!form.url?.trim() && !form.file) e.url = 'Provide a URL or upload a file';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        const payload = new FormData();
        payload.append('type', type);
        payload.append('title', form.title);
        if (form.url) payload.append('url', form.url);
        if (form.file) payload.append('file', form.file);
        if (form.id) {
            router.post(route('links.update', form.id), payload, { forceFormData: true, onSuccess: () => { resetForm(); onCompleted?.(); } });
        } else {
            router.post(route('links.store'), payload, { forceFormData: true, onSuccess: () => { resetForm(); onCompleted?.(); } });
        }
    };

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-3 py-2" />
                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Link / URL</label>
                <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="w-full border rounded px-3 py-2" placeholder={type === 'git' ? 'https://github.com/...' : 'Optional if file uploaded'} />
                {errors.url && <div className="text-red-500 text-xs mt-1">{errors.url}</div>}
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">File {type === 'git' ? '(disabled)' : ''}</label>
                <input type="file" disabled={type === 'git'} onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="col-span-2 text-right">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{form.id ? 'Update' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}</button>
            </div>
        </form>
    );
} 