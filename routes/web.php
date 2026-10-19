
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\FacultyLoginController;
use App\Http\Controllers\Auth\FacultyPasswordController;
use App\Http\Controllers\Faculty\TaskController;
use Inertia\Inertia;

// Faculty password setup form
Route::get('/faculty/setup-password/{token}', [FacultyPasswordController::class, 'edit'])
    ->middleware('guest')
    ->name('faculty.password.setup');

// Save new Faculty password
Route::post('/faculty/setup-password', [FacultyPasswordController::class, 'update'])
    ->middleware(['guest', 'throttle:5,1'])
    ->name('faculty.password.update');

/*
| Authentication Pages (Teammate)
|--------------------------------------------------------------------------
*/


Route::inertia('/forgot-password', 'forgotPassword')
    ->name('password.request');

// Faculty Login Page
Route::inertia('/faculty/login', 'facultyLogin')
    ->name('faculty.login');

// Process Faculty Login
Route::post('/faculty/login', [FacultyLoginController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('faculty.login.submit');

Route::inertia('/faculty/forgot-password', 'facultyForgotPassword')
    ->name('faculty.password.request');

    

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/

// Admin Login
Route::middleware('guest')->group(function () {

    Route::inertia('/login', 'login')
        ->name('login');

    Route::post('/login', [AdminLoginController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('admin.login.submit');

});

// Admin Logout - OUTSIDE the guest group
Route::post('/logout', [AdminLoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');




Route::middleware(['auth', 'admin'])->group(function () {
/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

Route::redirect('/', '/dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'admin'])
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
    ->whereNumber('faculty')
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

    });


/*
|--------------------------------------------------------------------------
| Faculty Portal
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'faculty'])->group(function () {

    // Faculty Dashboard
    Route::inertia('/faculty/dashboard', 'facultyDashboard')
        ->name('faculty.dashboard');

    // Faculty Content Management
    Route::inertia('/faculty/content', 'contentManagement')
        ->name('faculty.content');


    /*
    |--------------------------------------------------------------------------
    | Faculty Task Management
    |--------------------------------------------------------------------------
    */

    // Display Task Management
    Route::get('/faculty/tasks', [TaskController::class, 'index'])
        ->name('faculty.tasks');

    // Create Task
    Route::post('/faculty/tasks', [TaskController::class, 'store'])
        ->name('faculty.tasks.store');

    // Update Task
    Route::post('/faculty/tasks/{id}', [TaskController::class, 'update'])
        ->whereNumber('id')
        ->name('faculty.tasks.update');

    // Publish Task
    Route::patch('/faculty/tasks/{id}/publish', [TaskController::class, 'publish'])
        ->whereNumber('id')
        ->name('faculty.tasks.publish');

    // Cancel Task
    Route::patch('/faculty/tasks/{id}/cancel', [TaskController::class, 'cancel'])
        ->whereNumber('id')
        ->name('faculty.tasks.cancel');

    // Delete Task
    Route::delete('/faculty/tasks/{id}', [TaskController::class, 'destroy'])
        ->whereNumber('id')
        ->name('faculty.tasks.destroy');

    // Download Task Attachment
    Route::get('/faculty/tasks/{id}/attachment', [TaskController::class, 'downloadAttachment'])
        ->whereNumber('id')
        ->name('faculty.tasks.attachment');

});


// Faculty Logout
Route::post('/faculty/logout', [FacultyLoginController::class, 'logout'])
    ->middleware(['auth', 'faculty'])
    ->name('faculty.logout');

