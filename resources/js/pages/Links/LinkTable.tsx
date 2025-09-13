import React from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import type { Tab } from './LinkForm';
import { Eye, Trash2, Pencil, SquareArrowOutUpRight, FileCode, FileArchive, File, ImageUpscale, Presentation, FileImage, FileType2, FileText, FileSpreadsheet, FileAudio, AppWindow, FileVideo } from 'lucide-react';

export interface LinkItem {
    id: number;
    type: Tab;
    title: string;
    url?: string | null;
    file_path?: string | null;
    created_at?: string;
}

function getFileIcon(filePath: string | undefined) {
    if (!filePath) return null;

    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
        case 'zip':
            return <FileArchive className="w-6 h-6 text-gray-400" />;
        case 'pdf':
            return <File className="w-6 h-6 text-gray-400" />;
        case 'doc':
        case 'docx':
            return <FileType2 className="w-6 h-6 text-gray-400" />;
        case 'txt':
            return <FileText className="w-6 h-6 text-gray-400" />;
        case 'csv':
            return <FileSpreadsheet className="w-6 h-6 text-gray-400" />;
        case 'xlsx':
            return <FileSpreadsheet className="w-6 h-6 text-gray-400" />;
        case 'ppt':
        case 'pptx':
            return <Presentation className="w-6 h-6 text-gray-400" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return <FileImage className="w-6 h-6 text-gray-400" />;
        case 'mp3':
        case 'wav':
        case 'flac':
            return <FileAudio className="w-6 h-6 text-gray-400" />;
        case 'mp4':
        case 'mkv':
        case 'avi':
            return <FileVideo className="w-6 h-6 text-gray-400" />;
        case 'html':
        case 'css':
        case 'js':
            return <FileCode className="w-6 h-6 text-gray-400" />;
        case 'json':
            return <FileCode className="w-6 h-6 text-gray-400" />;
        case 'exe':
            return <AppWindow className="w-6 h-6 text-gray-400" />;
        case 'psd':
            return <ImageUpscale className="w-6 h-6 text-gray-400" />;
        case 'tar':
        case 'gz':
            return <FileArchive className="w-6 h-6 text-gray-400" />;
        default:
            return <FileCode className="w-6 h-6 text-gray-400" />;
    }

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
                            <td className="px-4 py-2">{item.url ? <a className="text-gray-400" title='URL' href={item.url} target="_blank"><SquareArrowOutUpRight className='w-4 h-4' /></a> : '--'}</td>
                            <td className="px-4 py-2">{item.file_path ? (
                                <a className="text-gray-400" title='Download File' href={`/storage/${item.file_path}`} target="_blank">
                                    {getFileIcon(item.file_path)}
                                </a>
                            ) : '-'}</td>
                            <td className="px-4 py-2 text-right">
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={() => onView(item)}
                                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                                        title="View"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="cursor-pointer text-green-600 hover:text-green-800"
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => doDelete(item)}
                                        className="cursor-pointer text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
