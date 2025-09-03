<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::latest()->paginate(10)->withQueryString();
        return Inertia::render('Report/Index', [
            'user' => auth()->user(),
            'reports' => $reports,
        ]);
    }

    public function create()
    {
        return Inertia::render('Report/Create', [
            'user' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'break_duration' => 'nullable|numeric', // minutes from UI
        ]);

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        if ($end->lessThanOrEqualTo($start)) {
            $end = $end->copy()->addDay();
        }

        $totalMinutes = $start->diffInMinutes($end);
        $breakMinutes = (int)($validated['break_duration'] ?? 0);
        $workingMinutes = max(0, $totalMinutes - $breakMinutes);

        $report = Report::create([
            'report' => $validated['report'],
            'start_time' => $start,
            'end_time' => $end,
            'working_hour' => round($workingMinutes / 60, 2),
            'total_hour' => round($totalMinutes / 60, 2),
            'break_duration' => round($breakMinutes / 60, 2),
        ]);

        return redirect()->route('reports.show', $report->id);
    }

    public function show(Report $report)
    {
        return Inertia::render('Report/Show', [
            'user' => auth()->user(),
            'report' => $report,
        ]);
    }

    public function edit(Report $report)
    {
        // Convert datetime to HTML datetime-local format
        $report->start_time = optional($report->start_time)->format('Y-m-d\TH:i');
        $report->end_time = optional($report->end_time)->format('Y-m-d\TH:i');

        return Inertia::render('Report/Edit', [
            'user' => auth()->user(),
            'report' => $report,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'report' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'break_duration' => 'nullable|numeric',
        ]);

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        if ($end->lessThanOrEqualTo($start)) {
            $end = $end->copy()->addDay();
        }

        $totalMinutes = $start->diffInMinutes($end);
        $breakMinutes = (int)($validated['break_duration'] ?? 0);
        $workingMinutes = max(0, $totalMinutes - $breakMinutes);

        $report->update([
            'report' => $validated['report'],
            'start_time' => $start,
            'end_time' => $end,
            'working_hour' => round($workingMinutes / 60, 2),
            'total_hour' => round($totalMinutes / 60, 2),
            'break_duration' => round($breakMinutes / 60, 2),
        ]);

        return redirect()->route('reports.show', $report->id);
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()->route('reports.index');
    }
}
