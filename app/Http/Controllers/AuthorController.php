<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authors = Author::latest()->get(['id','author_name','author_profile','featured_image'])
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'author_name' => $a->author_name,
                    'author_profile' => $a->author_profile,
                    'featured_image_url' => $a->featured_image ? asset('storage/'.$a->featured_image) : null,
                ];
            });
        return Inertia::render('Authors/Index', [
            'authors' => $authors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Authors/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'author_profile' => ['nullable', 'string', 'max:500'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
        ]);

        $imagePath = null;
        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('authors', 'public');
        }

        Author::create([
            'author_name' => $validated['author_name'],
            'author_profile' => $validated['author_profile'] ?? null,
            'featured_image' => $imagePath,
        ]);

        return redirect()->route('authors.index')->with('success', 'Author created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Author $author)
    {
        return Inertia::render('Authors/Edit', [
            'author' => $author,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'author_profile' => ['nullable', 'string', 'max:500'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('featured_image')) {
            if ($author->featured_image) {
                Storage::disk('public')->delete($author->featured_image);
            }
            $author->featured_image = $request->file('featured_image')->store('authors', 'public');
        }

        $author->fill([
            'author_name' => $validated['author_name'],
            'author_profile' => $validated['author_profile'] ?? null,
        ])->save();

        return redirect()->route('authors.index')->with('success', 'Author updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author)
    {
        if ($author->featured_image) {
            Storage::disk('public')->delete($author->featured_image);
        }
        $author->delete();
        return redirect()->route('authors.index')->with('success', 'Author deleted successfully');
    }
}
