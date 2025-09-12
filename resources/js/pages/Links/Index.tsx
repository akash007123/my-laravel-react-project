import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LinkForm, { type Tab } from './LinkForm';
import LinkTable, { type LinkItem } from './LinkTable';

interface PageProps { [key:string]: any; user: any; links: { data: LinkItem[] } }

const tabs: { key: Tab; label: string }[] = [
    { key: 'git', label: 'Git' },
    { key: 'excel', label: 'Excel' },
    { key: 'codebase', label: 'Codebase' },
];

export default function LinksIndex() {
    const { user, links } = usePage<PageProps>().props;
    const [active, setActive] = useState<Tab>('git');
    const [modal, setModal] = useState<{ mode: 'view' | 'edit' | 'add' | null; item?: LinkItem } | null>(null);

    const filtered = useMemo(() => (links?.data || []).filter(l => l.type === active), [links, active]);

    const openEdit = (item: LinkItem) => setModal({ mode: 'edit', item });
    const openView = (item: LinkItem) => setModal({ mode: 'view', item });
    const openAdd = () => setModal({ mode: 'add' });

    return (
        <AppLayout user={user}>
            <Head title="Links" />
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Links</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Back</Link>
                </div>

                {/* Tabs + Add */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setActive(t.key)} className={`cursor-pointer px-4 py-2 rounded border ${active === t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t.label}</button>
                        ))}
                    </div>
                    <div>
                        <button onClick={openAdd} className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">Add {tabs.find(t => t.key === active)?.label}</button>
                    </div>
                </div>

                {/* Table only */}
                <LinkTable items={filtered} onView={openView} onEdit={openEdit} />

                {/* View Modal */}
                {modal && modal.mode === 'view' && modal.item && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                            <button onClick={() => setModal(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500">✖️</button>
                            <h2 className="text-xl font-bold mb-4">{modal.item.title}</h2>
                            <div className="space-y-2 text-sm">
                                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{modal.item.type}</span></div>
                                {modal.item.url ? <div><span className="text-gray-500">URL:</span> <a className="text-blue-600" href={modal.item.url} target="_blank">{modal.item.url}</a></div> : null}
                                {modal.item.file_path ? <div><span className="text-gray-500">File:</span> <a className="text-blue-600" href={`/storage/${modal.item.file_path}`} target="_blank">Download</a></div> : null}
                                <div className="text-gray-500">Created: {modal.item.created_at}</div>
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={() => setModal(null)} className="px-4 py-2 border rounded">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                {modal && modal.mode === 'add' && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
                            <button onClick={() => setModal(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500">✖️</button>
                            <h2 className="text-xl font-bold mb-4">Add {tabs.find(t => t.key === active)?.label}</h2>
                            <LinkForm type={active} onCompleted={() => setModal(null)} />
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {modal && modal.mode === 'edit' && modal.item && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
                            <button onClick={() => setModal(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500">✖️</button>
                            <h2 className="text-xl font-bold mb-4">Edit {modal.item.type}</h2>
                            <LinkForm type={modal.item.type} initial={modal.item} onCompleted={() => setModal(null)} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 