
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Authentication Pages (Teammate)
|--------------------------------------------------------------------------
*/

Route::inertia('/login', 'login')->name('login');

Route::inertia('/forgot-password', 'forgotPassword')
    ->name('password.request');

Route::inertia('/faculty/login', 'facultyLogin')
    ->name('faculty.login');

Route::inertia('/faculty/forgot-password', 'facultyForgotPassword')
    ->name('faculty.password.request');

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

Route::redirect('/', '/dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Student Management
|--------------------------------------------------------------------------
*/

Route::get('/students', [StudentController::class, 'index'])
    ->name('students');

Route::post('/students', [StudentController::class, 'store'])
    ->name('students.store');

Route::put('/students/{student}', [StudentController::class, 'update'])
    ->name('students.update');

Route::patch('/students/{student}/status', [StudentController::class, 'updateStatus'])
    ->name('students.status');

Route::delete('/students/{student}', [StudentController::class, 'destroy'])
    ->name('students.destroy');

/*
|--------------------------------------------------------------------------
| Faculty Management
|--------------------------------------------------------------------------
*/

Route::get('/faculty', [FacultyController::class, 'index'])
    ->name('faculty');

Route::post('/faculty', [FacultyController::class, 'store'])
    ->name('faculty.store');

Route::get('/faculty/{faculty}', [FacultyController::class, 'show'])
    ->name('faculty.show');

Route::put('/faculty/{faculty}', [FacultyController::class, 'update'])
    ->name('faculty.update');

Route::patch('/faculty/{faculty}/status', [FacultyController::class, 'updateStatus'])
    ->name('faculty.status');

Route::delete('/faculty/{faculty}', [FacultyController::class, 'destroy'])
    ->name('faculty.destroy');

Route::put('/faculty/{faculty}/sections', [FacultyController::class, 'assignSections'])
    ->name('faculty.sections');

/*
|--------------------------------------------------------------------------
| Section Management
|--------------------------------------------------------------------------
*/

Route::get('/sections', [SectionController::class, 'index'])
    ->name('sections');

Route::post('/sections', [SectionController::class, 'store'])
    ->name('sections.store');

Route::get('/sections/{section}', [SectionController::class, 'show'])
    ->name('sections.show');

Route::put('/sections/{section}', [SectionController::class, 'update'])
    ->name('sections.update');

Route::patch('/sections/{section}/status', [SectionController::class, 'updateStatus'])
    ->name('sections.status');

Route::delete('/sections/{section}', [SectionController::class, 'destroy'])
    ->name('sections.destroy');

/*
|--------------------------------------------------------------------------
| Faculty Pages (Teammate)
|--------------------------------------------------------------------------
*/

Route::inertia('/faculty/dashboard', 'facultyDashboard')
    ->name('faculty.dashboard');

Route::inertia('/faculty/content', 'contentManagement')
    ->name('faculty.content');

Route::inertia('/faculty/tasks', 'facultyTaskManagement')
    ->name('faculty.tasks');

