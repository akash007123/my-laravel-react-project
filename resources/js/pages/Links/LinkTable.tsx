import React from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import type { Tab } from './LinkForm';

export interface LinkItem {
    id: number;
    type: Tab;
    title: string;
    url?: string | null;
    file_path?: string | null;
    created_at?: string;
}

export default function LinkTable({ items = [], onView, onEdit }: { items: LinkItem[]; onView: (l: LinkItem) => void; onEdit: (l: LinkItem) => void; }) {
    const doDelete = (item: LinkItem) => {
        if (!confirm('Delete this item?')) return;
        router.delete(route('links.destroy', item.id));
    };

    return (
        <div className="bg-white shadow rounded">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">URL</th>
                        <th className="px-4 py-2 text-left">File</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-t">
                            <td className="px-4 py-2">{item.title}</td>
                            <td className="px-4 py-2">{item.url ? <a className="text-blue-600" href={item.url} target="_blank">Open</a> : '-'}</td>
                            <td className="px-4 py-2">{item.file_path ? <a className="text-blue-600" href={`/storage/${item.file_path}`} target="_blank">Download</a> : '-'}</td>
                            <td className="px-4 py-2 text-right">
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => onView(item)} className="cursor-pointer px-3 py-1 border rounded">View</button>
                                    <button onClick={() => onEdit(item)} className="cursor-pointer px-3 py-1 border rounded">Edit</button>
                                    <button onClick={() => doDelete(item)} className="cursor-pointer px-3 py-1 border rounded text-red-600">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 