import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LinkForm, { type Tab } from './LinkForm';
import LinkTable, { type LinkItem } from './LinkTable';
import { SquareArrowOutUpRight, Github, FileTerminal, Code, FileCode, FileArchive, File, ImageUpscale, Presentation, FileImage, FileType2, FileText, FileSpreadsheet, FileAudio, AppWindow, FileVideo } from 'lucide-react';

import { formatDateWithWeekday } from '../utils'

interface PageProps { [key: string]: any; user: any; links: { data: LinkItem[] } }

const tabs: { key: Tab; label: string }[] = [
    { key: 'git', label: 'Git' },
    { key: 'excel', label: 'Excel' },
    { key: 'codebase', label: 'Codebase' },
];

function getFileIcon(filePath: string | undefined) {
    if (!filePath) return null;

    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
        case 'zip':
            return <FileArchive className="w-5 h-5 text-gray-400" />;
        case 'pdf':
            return <File className="w-5 h-5 text-gray-400" />;
        case 'doc':
        case 'docx':
            return <FileType2 className="w-5 h-5 text-gray-400" />;
        case 'txt':
            return <FileText className="w-5 h-5 text-gray-400" />;
        case 'csv':
            return <FileSpreadsheet className="w-5 h-5 text-gray-400" />;
        case 'xlsx':
            return <FileSpreadsheet className="w-5 h-5 text-gray-400" />;
        case 'ppt':
        case 'pptx':
            return <Presentation className="w-5 h-5 text-gray-400" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return <FileImage className="w-5 h-5 text-gray-400" />;
        case 'mp3':
        case 'wav':
        case 'flac':
            return <FileAudio className="w-5 h-5 text-gray-400" />;
        case 'mp4':
        case 'mkv':
        case 'avi':
            return <FileVideo className="w-5 h-5 text-gray-400" />;
        case 'html':
        case 'css':
        case 'js':
            return <FileCode className="w-5 h-5 text-gray-400" />;
        case 'json':
            return <FileCode className="w-5 h-5 text-gray-400" />;
        case 'exe':
            return <AppWindow className="w-5 h-5 text-gray-400" />;
        case 'psd':
            return <ImageUpscale className="w-5 h-5 text-gray-400" />;
        case 'tar':
        case 'gz':
            return <FileArchive className="w-5 h-5 text-gray-400" />;
        default:
            return <FileCode className="w-5 h-5 text-gray-400" />;
    }

}

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
                            <button onClick={() => setModal(null)} className="cursor-pointer absolute top-3 right-3 text-gray-500">X</button>
                            <h2 className="text-xl font-bold mb-4">{modal.item.title}</h2>
                            <div className="space-y-2 text-sm">
                                <div className='flex gap-3'>
                                    <span className="text-gray-500">Type:</span>
                                    <span className="font-medium capitalize">{modal.item.type}</span>
                                    {/* {modal.item.type === 'git' && <Github className="ml-2 w-5 h-5 text-black-600" />}
                                    {modal.item.type === 'excel' && <FileTerminal className="ml-2 w-5 h-5 text-red-600" />}
                                    {modal.item.type === 'codebase' && <Code className="ml-2 w-5 h-5 text-blue-600" />} */}
                                </div>
                                {modal.item.url ? (
                                    <div className='flex gap-4'>
                                        <span className="text-gray-500">URL:</span>
                                        <a href={modal.item.url} target="_blank" rel="noopener noreferrer">
                                            <SquareArrowOutUpRight className='w-5 h-5' />
                                        </a>
                                    </div>
                                ) : null}

                                {modal.item.file_path ? <div className='flex gap-2'><span className="text-gray-500">File:</span> <a className="text-blue-600" href={`/storage/${getFileIcon(modal.item.file_path)}`} target="_blank">{getFileIcon(modal.item.file_path)}</a></div> : null}
                                <div className="text-gray-500">Created: {formatDateWithWeekday(modal.item.created_at ?? '')}</div>
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={() => setModal(null)} className="cursor-pointer px-4 py-2 text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-black dark:hover:bg-black focus:outline-none dark:focus:ring-black">Close</button>
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