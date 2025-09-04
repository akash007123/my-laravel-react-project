<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $sortBy = in_array($request->get('sortBy'), ['full_name', 'email', 'company_name', 'created_at']) ? $request->get('sortBy') : 'created_at';
        $sortDir = $request->get('sortDir') === 'asc' ? 'asc' : 'desc';

        $leads = Lead::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('full_name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                       ->orWhere('company_name', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        Lead::create($validated);

        return Redirect::back()->with('success', 'Lead created successfully.');
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $lead->update($validated);

        return Redirect::back()->with('success', 'Lead updated successfully.');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return Redirect::back()->with('success', 'Lead deleted successfully.');
    }
} 