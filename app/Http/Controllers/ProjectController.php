<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projects = Project::latest()->paginate(10)->through(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'technologies' => $project->technologies,
                'description' => $project->description,
                'client_name' => $project->client_name,
                'project_manager' => $project->project_manager,
                'image_url' => $project->image_path ? asset('storage/'.$project->image_path) : null, 
                'start_date' => $project->start_date?->toDateString(),
                'end_date' => $project->end_date?->toDateString(),
            ];
        });

        // Get all projects for card view (no pagination)
        $allProjects = Project::latest()->get()->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'technologies' => $project->technologies,
                'description' => $project->description,
                'client_name' => $project->client_name,
                'project_manager' => $project->project_manager,
                'image_url' => $project->image_path ? asset('storage/'.$project->image_path) : null, 
                'start_date' => $project->start_date?->toDateString(),
                'end_date' => $project->end_date?->toDateString(),
            ];
        });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'allProjects' => $allProjects,
            'tab' => $request->get('tab', 'List'),
            "user" => auth()->user()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:100'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'client_name' => ['required', 'string', 'max:255'],
            'project_manager' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if (is_string($validated['technologies'] ?? null)) {
            $validated['technologies'] = array_values(array_filter(array_map('trim', explode(',', $validated['technologies']))));
        }

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('projects', 'public');
        }

        Project::create($validated);

        return to_route('projects.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'technologies' => $project->technologies,
                'description' => $project->description,
                'start_date' => $project->start_date?->toDateString(),
                'end_date' => $project->end_date?->toDateString(),
                'client_name' => $project->client_name,
                'project_manager' => $project->project_manager,
                'image_url' => $project->image_path ? asset('storage/'.$project->image_path) : null,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:100'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'client_name' => ['required', 'string', 'max:255'],
            'project_manager' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if (is_string($validated['technologies'] ?? null)) {
            $validated['technologies'] = array_values(array_filter(array_map('trim', explode(',', $validated['technologies']))));
        }

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('projects', 'public');
        }

        $project->update($validated);

        return to_route('projects.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();
        return back();
    }
}
