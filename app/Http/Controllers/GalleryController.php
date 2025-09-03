<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $items = Gallery::with('user:id,name')
            ->latest()
            ->get()
            ->map(fn ($g) => [
                'id' => $g->id,
                'title' => $g->title,
                'image_url' => $g->image_path ? (Storage::url($g->image_path) . '?v=' . optional($g->updated_at)->timestamp) : null,
                'uploader' => $g->user?->name,
            ]);

        return Inertia::render('Gallery/Index', [
            'user' => auth()->user(),
            'gallery' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        Gallery::create([
            'title' => $data['title'],
            'image_path' => $path,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('gallery.index');
    }

    public function update(Request $request, Gallery $gallery)
    {
        // info($request);
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
        ]);
        if ($request->hasFile('image')) {
            if ($gallery->image_path) {
                Storage::disk('public')->delete($gallery->image_path);
            }
            $data['image_path'] = $request->file('image')->store('gallery', 'public');
        }

        $gallery->update([
            'title' => $data['title'] ?? $gallery->title,
            'image_path' => $data['image_path'] ?? $gallery->image_path,
        ]);

        return redirect()->route('gallery.index');
    }

}
