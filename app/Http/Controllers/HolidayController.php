<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $holidays = Holiday::orderBy('holiday_date')->get()->map(function ($holiday) {
            return [
                'id' => $holiday->id,
                'holiday_name' => $holiday->holiday_name,
                'holiday_date' => $holiday->holiday_date->toDateString(),
                'day' => $holiday->day,
                'formatted_date' => $holiday->formatted_date,
            ];
        });

        return Inertia::render('Holidays/Index', [
            'holidays' => $holidays,
            "user" => auth()->user()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Holidays/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'holiday_name' => ['required', 'string', 'max:255'],
            'holiday_date' => ['required', 'date'],
        ]);

        Holiday::create($validated);

        return to_route('holidays.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Holiday $holiday)
    {
        return Inertia::render('Holidays/Show', [
            'holiday' => [
                'id' => $holiday->id,
                'holiday_name' => $holiday->holiday_name,
                'holiday_date' => $holiday->holiday_date->toDateString(),
                'day' => $holiday->day,
                'formatted_date' => $holiday->formatted_date,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Holiday $holiday)
    {
        return Inertia::render('Holidays/Edit', [
            'holiday' => [
                'id' => $holiday->id,
                'holiday_name' => $holiday->holiday_name,
                'holiday_date' => $holiday->holiday_date->toDateString(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Holiday $holiday)
    {
        $validated = $request->validate([
            'holiday_name' => ['required', 'string', 'max:255'],
            'holiday_date' => ['required', 'date'],
        ]);

        $holiday->update($validated);

        return to_route('holidays.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Holiday $holiday)
    {
        $holiday->delete();

        return to_route('holidays.index');
    }
}
