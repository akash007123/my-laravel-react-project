<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use Illuminate\Support\Carbon;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/project', function () {
    return Inertia::render('project');
})->name('project');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $totalEvents = \App\Models\Event::count();
        $totalUsers = \App\Models\User::count();
        $totalProjects = \App\Models\Project::count();
        $totalHolidays = \App\Models\Holiday::count();
        $totalGallery = \App\Models\Gallery::count();
        $totalDepartments = \App\Models\Department::count();
        $totalLeads = \App\Models\Lead::count();
        $totalApplicants = \App\Models\Applicant::count();
        
        $recentProjects = \App\Models\Project::latest()->take(3)->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'project_manager' => $p->project_manager,
                'image_url' => $p->image_path ? asset('storage/'.$p->image_path) : null,
            ];
        });
        $recentEvents= \App\Models\Event::latest()->take(3)->get()->map(function ($e) {
            return [
                'id' => $e->id,
                'title' => $e->title,
                'event_date' => $e->event_date,
                'status' => $e->status,
                'image_url' => $e->image_path ? asset('storage/'.$e->image_path) : null,
            ];
        });

        $recentHolidays= \App\Models\Holiday::latest()->take(3)->get()->map(function ($h) {
            return [
                'id' => $h->id,
                'holiday_name' => $h->holiday_name,
                'holiday_date' => $h->holiday_date,
                'day' => $h->day,
            ];
        });

        $recentDepartments= \App\Models\Department::latest()->take(3)->get()->map(function ($d) {
            return [
                'id' => $d->id,
                'department_name' => $d->department_name,
                'department_head' => $d->department_head,
            ];
        });
        $recentApplicants= \App\Models\Applicant::latest()->take(3)->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'name' => $a->name,
                'email' => $a->email,
                'mobile' => $a->mobile,
            ];
        });
       
       
        $yesterday = Carbon::yesterday();
        $totalReports = \App\Models\Report::whereDate('created_at', $yesterday)->count(); //use carbon for display yesterday reports only
        return Inertia::render('dashboard', [
            'user' => auth()->user(),
            // Counts
            'totalEvents' => $totalEvents,
            'totalUsers' => $totalUsers,
            'totalProjects' => $totalProjects,
            'totalHolidays' => $totalHolidays,
            'totalGallery' => $totalGallery,
            'totalDepartments' => $totalDepartments,
            'totalReports' => $totalReports,
            'totalLeads' => $totalLeads,
            'totalApplicants' => $totalApplicants,

            // Show Recents
            'recentProjects' => $recentProjects,
            'recentEvents' => $recentEvents,
            'recentHolidays' => $recentHolidays,
            'recentDepartments' => $recentDepartments,
            'recentApplicants' => $recentApplicants,
        ]);
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("projects", \App\Http\Controllers\ProjectController::class);
    Route::resource("events", \App\Http\Controllers\EventController::class);
    Route::resource("holidays", \App\Http\Controllers\HolidayController::class);
    Route::resource("gallery", \App\Http\Controllers\GalleryController::class);
    Route::resource("department", \App\Http\Controllers\DepartmentController::class);
    Route::resource("reports", \App\Http\Controllers\ReportController::class);
    Route::resource("layout", \App\Http\Controllers\LayoutController::class);
    Route::resource("leads", \App\Http\Controllers\LeadController::class);
    Route::resource("applicants", \App\Http\Controllers\ApplicantController::class);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
