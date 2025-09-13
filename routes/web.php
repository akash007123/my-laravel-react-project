<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use Illuminate\Support\Carbon;
// Use Controllers
use App\Http\Controllers\LinkController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\TestimonialsController;

// use Models
use App\Models\Event;
use App\Models\User;
use App\Models\Project;
use App\Models\Holiday;
use App\Models\Gallery;
use App\Models\Department;
use App\Models\Lead;
use App\Models\Applicant;
use App\Models\Testimonial;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/project', function () {
    return Inertia::render('project');
})->name('project');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $totalEvents = Event::count();
        $totalUsers = User::count();
        $totalProjects = Project::count();
        $totalHolidays = Holiday::count();
        $totalGallery = Gallery::count();
        $totalDepartments = Department::count();
        $totalLeads = Lead::count();
        $totalApplicants = Applicant::count();
        $recentProjects = Project::latest()->take(3)->get()->map(function ($p) {
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
                'city' => $a->city,
            ];
        });
       $recentLeads= \App\Models\Lead::latest()->take(3)->get()->map(function ($l) {
            return [
                'id' => $l->id,
                'full_name' => $l->full_name,
                'email' => $l->email,
                'company_name' => $l->company_name,
                'country' => $l->country,
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
            'recentLeads' => $recentLeads,

        ]);
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("projects", ProjectController::class);
    Route::resource("events", EventController::class);
    Route::resource("holidays",HolidayController::class);
    Route::resource("gallery",GalleryController::class);
    Route::resource("department",DepartmentController::class);
    Route::resource("reports",ReportController::class);
    Route::resource("layout",LayoutController::class);
    Route::resource("leads",LeadController::class);
    Route::resource("applicants",ApplicantController::class);
    Route::resource("testimonials",TestimonialsController::class);
    Route::get('/links', [LinkController::class, 'index'])->name('links.index');
    Route::post('/links', [LinkController::class, 'store'])->name('links.store');
    Route::post('/links/{link}', [LinkController::class, 'update'])->name('links.update');
    Route::delete('/links/{link}', [LinkController::class, 'destroy'])->name('links.destroy');
    Route::get('/map', [MapController::class, 'show']);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';