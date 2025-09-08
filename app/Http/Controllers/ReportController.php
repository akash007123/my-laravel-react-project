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

    private function minutesToTimeString(int $minutes): string
    {
        $minutes = max(0, $minutes);
        $hours = intdiv($minutes, 60);
        $mins = $minutes % 60;
        // MySQL TIME can store large hours (e.g., 838:59:59 upper bound), so we keep HH:MM:SS
        return sprintf('%02d:%02d:00', $hours, $mins);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'break_duration' => 'nullable|numeric', // minutes
        ]);

        $startTimeStr = $validated['start_time'] . ':00';
        $endTimeStr = $validated['end_time'] . ':00';

        // Use today's date only for calculating duration properly (including overnight)
        $today = Carbon::today();
        $start = Carbon::createFromFormat('Y-m-d H:i', $today->format('Y-m-d') . ' ' . $validated['start_time']);
        $end = Carbon::createFromFormat('Y-m-d H:i', $today->format('Y-m-d') . ' ' . $validated['end_time']);
        if ($end->lessThan($start)) {
            $end = $end->copy()->addDay();
        }

        $totalMinutes = $start->diffInMinutes($end);
        $breakMinutes = (int)($validated['break_duration'] ?? 0);
        $workingMinutes = max(0, $totalMinutes - $breakMinutes);

        $report = Report::create([
            'report' => $validated['report'],
            'start_time' => $startTimeStr,
            'end_time' => $endTimeStr,
            'working_hour' => $this->minutesToTimeString($workingMinutes),
            'total_hour' => $this->minutesToTimeString($totalMinutes),
            'break_duration' => $this->minutesToTimeString($breakMinutes),
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
            'report' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'break_duration' => 'nullable|numeric', // minutes
        ]);

        $startTimeStr = $validated['start_time'] . ':00';
        $endTimeStr = $validated['end_time'] . ':00';

        // Calculate totals using the report's original date as reference for overnight logic
        $referenceDate = now()->format('Y-m-d');
        $start = Carbon::createFromFormat('Y-m-d H:i', $referenceDate . ' ' . $validated['start_time']);
        $end = Carbon::createFromFormat('Y-m-d H:i', $referenceDate . ' ' . $validated['end_time']);
        if ($end->lessThan($start)) {
            $end = $end->copy()->addDay();
        }

        $totalMinutes = $start->diffInMinutes($end);
        $breakMinutes = (int)($validated['break_duration'] ?? 0);
        $workingMinutes = max(0, $totalMinutes - $breakMinutes);

        $report->update([
            'report' => $validated['report'],
            'start_time' => $startTimeStr,
            'end_time' => $endTimeStr,
            'working_hour' => $this->minutesToTimeString($workingMinutes),
            'total_hour' => $this->minutesToTimeString($totalMinutes),
            'break_duration' => $this->minutesToTimeString($breakMinutes),
        ]);

        return redirect()->route('reports.show', $report->id);
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()->route('reports.index');
    }
}
