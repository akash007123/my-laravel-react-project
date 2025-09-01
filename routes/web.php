<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/project', function () {
    return Inertia::render('project');
})->name('project');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'user' => auth()->user()
        ]);
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("projects", \App\Http\Controllers\ProjectController::class);
    Route::resource("events", \App\Http\Controllers\EventController::class);
    Route::resource("holidays", \App\Http\Controllers\HolidayController::class);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
