<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class TestimonialsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $testimonials = Testimonial::with('user')->latest()->get();
        return Inertia::render('Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Testimonials/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'     => 'nullable|exists:users,id',
            'fullname'    => 'required|string|max:255',
            'email'       => 'nullable|email',
            'phone'       => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'company'     => 'nullable|string|max:255',
            'message'     => 'required|string',
            'rating'      => 'nullable|integer|min:1|max:5',
            'profile'     => 'nullable|image|max:2048',
            'is_active'   => 'boolean',
        ]);

        if ($request->hasFile('profile')) {
            $path = $request->file('profile')->store('profiles', 'public');
            $validated['profile'] = $path;
        }

        Testimonial::create($validated);

        return redirect()->route('layout.index')->with('success', 'Testimonial created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        $testimonial->load('user');
        return Inertia::render('Testimonials/Show', [
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimonial $testimonial)
    {
        $testimonial->load('user');
        return Inertia::render('Testimonials/Update', [
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'user_id'     => 'nullable|exists:users,id',
            'fullname'    => 'required|string|max:255',
            'email'       => 'nullable|email',
            'phone'       => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'company'     => 'nullable|string|max:255',
            'message'     => 'required|string',
            'rating'      => 'nullable|integer|min:1|max:5',
            'profile'     => 'nullable|image|max:2048',
            'is_active'   => 'boolean',
        ]);

        if ($request->hasFile('profile')) {
            $path = $request->file('profile')->store('profiles', 'public');
            $validated['profile'] = $path;
        } else {
            unset($validated['profile']);
        }

        $testimonial->update($validated);

        return redirect()->route('layout.index')->with('success', 'Testimonial updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()->route('layout.index')->with('success', 'Testimonial deleted successfully!');
    }
}
