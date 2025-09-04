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
       
        $yesterday = Carbon::yesterday();
        $totalReports = \App\Models\Report::whereDate('created_at', $yesterday)->count(); //use carbon for display yesterday reports only
        return Inertia::render('dashboard', [
            'user' => auth()->user(),
            'totalEvents' => $totalEvents,
            'totalUsers' => $totalUsers,
            'totalProjects' => $totalProjects,
            'totalHolidays' => $totalHolidays,
            'totalGallery' => $totalGallery,
            'totalDepartments' => $totalDepartments,
            'totalReports' => $totalReports,
            'totalLeads' => $totalLeads,
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
    Route::resource('leads', \App\Http\Controllers\LeadController::class);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
