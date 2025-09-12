<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LinkController extends Controller
{
    public function index()
    {
        $links = Link::latest()->paginate(20)->withQueryString();
        return Inertia::render('Links/Index', [
            'user' => auth()->user(),
            'links' => $links,
        ]);
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'type' => 'required|in:git,excel,codebase',
            'title' => 'required|string|max:255',
            'url' => 'nullable|url',
            'file' => 'nullable|file',
        ];
        $data = $request->validate($rules);

        // Require at least one of file or url for excel/codebase
        if (in_array($data['type'], ['excel', 'codebase'])) {
            if (!$request->hasFile('file') && empty($data['url'])) {
                abort(422, 'Either file or url is required.');
            }
        }

        return $data;
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('links', 'public');
        }

        $link = Link::create([
            'type' => $data['type'],
            'title' => $data['title'],
            'url' => $data['url'] ?? null,
            'file_path' => $filePath,
        ]);

        return redirect()->route('links.index');
    }

    public function update(Request $request, Link $link)
    {
        $data = $this->validateData($request, true);
        $filePath = $link->file_path;
        if ($request->hasFile('file')) {
            if ($filePath) Storage::disk('public')->delete($filePath);
            $filePath = $request->file('file')->store('links', 'public');
        }
        $link->update([
            'type' => $data['type'],
            'title' => $data['title'],
            'url' => $data['url'] ?? null,
            'file_path' => $filePath,
        ]);
        return redirect()->route('links.index');
    }

    public function destroy(Link $link)
    {
        if ($link->file_path) Storage::disk('public')->delete($link->file_path);
        $link->delete();
        return redirect()->route('links.index');
    }
} 