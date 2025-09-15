<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Author;
use App\Models\Category;
use App\Models\Tag;
use App\Models\BlogSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::with(['author', 'category', 'tags'])
            ->latest()
            ->paginate(10)
            ->through(function ($b) {
                return [
                    'id' => $b->id,
                    'title' => $b->title,
                    'slug' => $b->slug,
                    'status' => $b->status,
                    'author' => $b->author?->author_name,
                    'author_image_url' => ($b->author && $b->author->featured_image) ? asset('storage/'.$b->author->featured_image) : null,
                    'category' => $b->category?->name,
                    'featured_image_url' => $b->featured_image ? asset('storage/'.$b->featured_image) : null,
                    'tags' => $b->tags->pluck('name'),
                ];
            });

        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function cardPage(Request $request)
    {
        $categoryId = $request->query('category_id');
        $q = $request->query('q');

        $query = Blog::with(['author','category','tags'])
            ->when($categoryId, function ($builder) use ($categoryId) {
                $builder->where('category_id', $categoryId);
            })
            ->when($q, function ($builder) use ($q) {
                $builder->where(function ($sub) use ($q) {
                    $sub->where('title', 'like', "%{$q}%")
                        ->orWhereHas('author', function ($a) use ($q) {
                            $a->where('author_name', 'like', "%{$q}%");
                        });
                });
            })
            ->latest();

        $blogs = $query->paginate(6)->appends($request->only(['category_id', 'q']))
            ->through(function ($b) {
                return [
                    'id' => $b->id,
                    'title' => $b->title,
                    'excerpt' => $b->excerpt,
                    'featured_image_url' => $b->featured_image ? asset('storage/'.$b->featured_image) : null,
                    'author' => $b->author?->author_name,
                    'author_image_url' => ($b->author && $b->author->featured_image) ? asset('storage/'.$b->author->featured_image) : null,
                    'category' => $b->category?->name,
                    'tags' => $b->tags->map->only(['id','name']),
                    'status' => $b->status,
                    'created_at' => optional($b->created_at)->toDateString(),
                ];
            });

        $categories = Category::orderBy('name')->get(['id','name']);

        return Inertia::render('Blogs/BlogCardPage', [
            'blogs' => $blogs,
            'filters' => [
                'category_id' => $categoryId,
                'q' => $q,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Blogs/Create', [
            'authors' => Author::select('id', 'author_name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'tags' => Tag::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_id' => ['nullable', 'exists:authors,id'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'author_image' => ['nullable', 'image', 'max:2048'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'category_name' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogs,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'in:draft,published'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'tag_names' => ['array'],
            'tag_names.*' => ['string', 'max:40'],
            'sections' => ['array'],
            'sections.*.heading' => ['nullable', 'string', 'max:255'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'sections.*.image_url' => ['nullable', 'url'],
        ]);

        if (empty($validated['author_id'])) {
            if (empty($validated['author_name'])) {
                return back()->withErrors(['author_name' => 'Author name is required when no author is selected.'])->withInput();
            }
            $authorImagePath = null;
            if ($request->hasFile('author_image')) {
                $authorImagePath = $request->file('author_image')->store('authors', 'public');
            }
            $author = Author::create([
                'author_name' => $validated['author_name'],
                'featured_image' => $authorImagePath,
            ]);
            $validated['author_id'] = $author->id;
        }

        if (empty($validated['category_id']) && !empty($validated['category_name'])) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($validated['category_name'])],
                ['name' => $validated['category_name'], 'status' => 'active']
            );
            $validated['category_id'] = $category->id;
        }

        // Upsert custom tags and merge to tag_ids
        $tagIds = $validated['tag_ids'] ?? [];
        foreach (($validated['tag_names'] ?? []) as $name) {
            $tag = Tag::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
            $tagIds[] = $tag->id;
        }
        $tagIds = array_values(array_unique($tagIds));

        $slug = $validated['slug'] ?? Str::slug($validated['title']);
        if (Blog::where('slug', $slug)->exists()) {
            $slug = $slug.'-'.Str::random(6);
        }

        $featuredPath = null;
        if ($request->hasFile('featured_image')) {
            $featuredPath = $request->file('featured_image')->store('blogs/featured', 'public');
        }

        $blog = Blog::create([
            'author_id' => $validated['author_id'],
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'] ?? null,
            'featured_image' => $featuredPath,
            'status' => $validated['status'],
        ]);

        if (!empty($tagIds)) {
            $blog->tags()->sync($tagIds);
        }

        // Sections
        foreach (($validated['sections'] ?? []) as $index => $section) {
            $imagePath = null;
            if (!empty($section['image'])) {
                $imagePath = $section['image']->store('blogs/sections', 'public');
            }
            BlogSection::create([
                'blog_id' => $blog->id,
                'heading' => $section['heading'] ?? null,
                'content' => $section['content'] ?? null,
                'image_path' => $imagePath,
                'image_url' => $section['image_url'] ?? null,
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        $blog->load(['author', 'category', 'tags', 'sections']);

        // Related by same category, exclude current
        $related = collect();
        if ($blog->category_id) {
            $related = Blog::with(['author'])
                ->where('category_id', $blog->category_id)
                ->where('id', '!=', $blog->id)
                ->latest()
                ->take(6)
                ->get()
                ->map(function ($b) {
                    return [
                        'id' => $b->id,
                        'title' => $b->title,
                        'featured_image_url' => $b->featured_image ? asset('storage/'.$b->featured_image) : null,
                        'author_image_url' => $b->author && $b->author->featured_image ? asset('storage/'.$b->author->featured_image) : null,
                        'author' => $b->author?->author_name,
                        'created_at' => optional($b->created_at)->toDateString(),
                    ];
                });
        }

        return Inertia::render('Blogs/Show', [
            'blog' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
                'excerpt' => $blog->excerpt,
                'content' => $blog->content,
                'status' => $blog->status,
                'featured_image_url' => $blog->featured_image ? asset('storage/'.$blog->featured_image) : null,
                'author_image_url' => $blog->author && $blog->author->featured_image ? asset('storage/'.$blog->author->featured_image) : null,
                'author' => $blog->author?->only(['id','author_name']),
                'category' => $blog->category?->only(['id','name']),
                'tags' => $blog->tags->map->only(['id','name']),
                'sections' => $blog->sections->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'heading' => $s->heading,
                        'content' => $s->content,
                        'image_url' => $s->image_url ?: ($s->image_path ? asset('storage/'.$s->image_path) : null),
                        'sort_order' => $s->sort_order,
                    ];
                }),
                'created_at' => optional($blog->created_at)->toDateString(),
            ],
            'related' => $related,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        $blog->load(['tags', 'sections']);
        return Inertia::render('Blogs/Edit', [
            'blog' => $blog,
            'authors' => Author::select('id', 'author_name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'tags' => Tag::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'author_id' => ['required', 'exists:authors,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogs,slug,'.$blog->id],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'in:draft,published'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'sections' => ['array'],
            'sections.*.id' => ['nullable', 'integer', 'exists:blog_sections,id'],
            'sections.*.heading' => ['nullable', 'string', 'max:255'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'sections.*.image_url' => ['nullable', 'url'],
            'sections.*._delete' => ['nullable', 'boolean'],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['title']);
        if (Blog::where('slug', $slug)->where('id', '!=', $blog->id)->exists()) {
            $slug = $slug.'-'.Str::random(6);
        }

        if ($request->hasFile('featured_image')) {
            if ($blog->featured_image) {
                Storage::disk('public')->delete($blog->featured_image);
            }
            $blog->featured_image = $request->file('featured_image')->store('blogs/featured', 'public');
        }

        $blog->fill([
            'author_id' => $validated['author_id'],
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'] ?? null,
            'status' => $validated['status'],
        ])->save();

        $blog->tags()->sync($validated['tag_ids'] ?? []);

        // Sections upsert/delete and reorder
        $seenIds = [];
        foreach (($validated['sections'] ?? []) as $index => $section) {
            if (!empty($section['_delete']) && !empty($section['id'])) {
                $sec = BlogSection::where('blog_id', $blog->id)->where('id', $section['id'])->first();
                if ($sec) {
                    if ($sec->image_path) Storage::disk('public')->delete($sec->image_path);
                    $sec->delete();
                }
                continue;
            }

            $imagePath = null;
            if (!empty($section['image'])) {
                $imagePath = $section['image']->store('blogs/sections', 'public');
            }

            if (!empty($section['id'])) {
                $sec = BlogSection::where('blog_id', $blog->id)->where('id', $section['id'])->firstOrFail();
                $update = [
                    'heading' => $section['heading'] ?? null,
                    'content' => $section['content'] ?? null,
                    'image_url' => $section['image_url'] ?? $sec->image_url,
                    'sort_order' => $index,
                ];
                if ($imagePath) {
                    if ($sec->image_path) Storage::disk('public')->delete($sec->image_path);
                    $update['image_path'] = $imagePath;
                }
                $sec->update($update);
                $seenIds[] = $sec->id;
            } else {
                $sec = BlogSection::create([
                    'blog_id' => $blog->id,
                    'heading' => $section['heading'] ?? null,
                    'content' => $section['content'] ?? null,
                    'image_path' => $imagePath,
                    'image_url' => $section['image_url'] ?? null,
                    'sort_order' => $index,
                ]);
                $seenIds[] = $sec->id;
            }
        }

        return redirect()->route('blogs.edit', $blog->id)->with('success', 'Blog updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        // Delete images
        if ($blog->featured_image) {
            Storage::disk('public')->delete($blog->featured_image);
        }
        foreach ($blog->sections as $section) {
            if ($section->image_path) Storage::disk('public')->delete($section->image_path);
        }

        $blog->tags()->detach();
        $blog->sections()->delete();
        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully');
    }
}
