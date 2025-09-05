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
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'break_duration' => 'nullable|numeric', // minutes from UI
            'total_working_hour' => 'nullable|numeric|min:0',
            'total_office_hour' => 'nullable|numeric|min:0',
        ]);

        // Get current date
        $today = Carbon::today();
        
        // Combine current date with time inputs
        $start = Carbon::createFromFormat('Y-m-d H:i', $today->format('Y-m-d') . ' ' . $validated['start_time']);
        $end = Carbon::createFromFormat('Y-m-d H:i', $today->format('Y-m-d') . ' ' . $validated['end_time']);
        
        // Only add a day if end time is actually before start time (e.g., 11 PM to 2 AM)
        // For normal work hours like 10:00 AM to 7:30 PM, this should NOT add a day
        if ($end->lessThan($start)) {
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
            'total_working_hour' => $validated['total_working_hour'] ?? 0,
            'total_office_hour' => $validated['total_office_hour'] ?? 0,
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
        return Inertia::render('Report/Edit', [
            'user' => auth()->user(),
            'report' => $report,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'report' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'break_duration' => 'nullable|numeric',
            'total_working_hour' => 'nullable|numeric|min:0',
            'total_office_hour' => 'nullable|numeric|min:0',
        ]);

        // Get the original date from the existing report
        $originalDate = $report->start_time->format('Y-m-d');
        
        // Combine original date with new time inputs
        $start = Carbon::createFromFormat('Y-m-d H:i', $originalDate . ' ' . $validated['start_time']);
        $end = Carbon::createFromFormat('Y-m-d H:i', $originalDate . ' ' . $validated['end_time']);
        
        // Only add a day if end time is actually before start time (e.g., 11 PM to 2 AM)
        // For normal work hours like 10:00 AM to 7:30 PM, this should NOT add a day
        if ($end->lessThan($start)) {
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
            'total_working_hour' => $validated['total_working_hour'] ?? 0,
            'total_office_hour' => $validated['total_office_hour'] ?? 0,
        ]);

        return redirect()->route('reports.show', $report->id);
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()->route('reports.index');
    }
}
