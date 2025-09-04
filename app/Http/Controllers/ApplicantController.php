<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    public function index(Request $request)
    {
        $applicants = Applicant::latest()->paginate(10);
        return Inertia::render('Applicants/Index', [
            'applicants' => $applicants,
        ]);
    }

    public function create()
    {
        return Inertia::render('Applicants/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'mobile' => ['required', 'string', 'max:30'],
            'alternate_mobile' => ['nullable', 'string', 'max:30'],
            'resume' => ['nullable', 'string', 'max:255'],
            'resume_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'skills' => ['nullable', 'string'],
            'dob' => ['nullable', 'date'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', 'string', 'max:50'],
            'experience' => ['nullable', 'string', 'max:50'],
            'joining_timeframe' => ['nullable', 'string', 'max:50'],
            'bond_agreement' => ['nullable', 'boolean'],
            'branch' => ['nullable', 'string', 'max:255'],
            'graduate_year' => ['nullable', 'string', 'max:10'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('resume_file')) {
            $path = $request->file('resume_file')->store('resumes', 'public');
            $validated['resume'] = $path;
        }
        if ($request->has('bond_agreement')) {
            $validated['bond_agreement'] = $request->boolean('bond_agreement');
        }

        Applicant::create($validated);

        return Redirect::route('applicants.index')->with('success', 'Applicant created.');
    }

    public function show(Request $request, Applicant $applicant)
    {
        if ($request->wantsJson()) {
            return response()->json($applicant);
        }

        return Inertia::render('Applicants/Show', [
            'applicant' => $applicant,
        ]);
    }

    public function edit(Applicant $applicant)
    {
        return Inertia::render('Applicants/Edit', [
            'applicant' => $applicant,
        ]);
    }

    public function update(Request $request, Applicant $applicant)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'mobile' => ['required', 'string', 'max:30'],
            'alternate_mobile' => ['nullable', 'string', 'max:30'],
            'resume' => ['nullable', 'string', 'max:255'],
            'resume_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'skills' => ['nullable', 'string'],
            'dob' => ['nullable', 'date'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', 'string', 'max:50'],
            'experience' => ['nullable', 'string', 'max:50'],
            'joining_timeframe' => ['nullable', 'string', 'max:50'],
            'bond_agreement' => ['nullable', 'boolean'],
            'branch' => ['nullable', 'string', 'max:255'],
            'graduate_year' => ['nullable', 'string', 'max:10'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('resume_file')) {
            $path = $request->file('resume_file')->store('resumes', 'public');
            $validated['resume'] = $path;
        }
        if ($request->has('bond_agreement')) {
            $validated['bond_agreement'] = $request->boolean('bond_agreement');
        }

        $applicant->update($validated);

        return Redirect::route('applicants.index')->with('success', 'Applicant updated.');
    }

    public function destroy(Applicant $applicant)
    {
        $applicant->delete();
        return Redirect::back()->with('success', 'Applicant deleted.');
    }
}
