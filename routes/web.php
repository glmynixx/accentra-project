<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/login', 'login')->name('login');

Route::inertia('/', 'dashboard')->name('home');

Route::inertia('/faculty', 'facultyManagement')->name('faculty');

Route::inertia('/students', 'studentManagement')->name('students');

Route::inertia('/sections', 'sectionManagement')->name('sections');

Route::inertia('/forgot-password', 'forgotPassword')
    ->name('password.request');

Route::inertia('/faculty/login', 'facultyLogin')
    ->name('faculty.login');

Route::inertia('/faculty/forgot-password', 'facultyForgotPassword')
    ->name('faculty.password.request');

Route::inertia('/faculty/dashboard', 'facultyDashboard')
    ->name('faculty.dashboard');

Route::inertia('/faculty/content', 'contentManagement')
    ->name('faculty.content');

Route::inertia('/faculty/tasks', 'facultyTaskManagement')
    ->name('faculty.tasks');

Route::get('/faculty/tasks/data', [TaskController::class, 'index'])
    ->name('faculty.tasks.data');

Route::post('/faculty/tasks', [TaskController::class, 'store'])
    ->name('faculty.tasks.store');

Route::get('/faculty/tasks/{task}/attachment', [TaskController::class, 'downloadAttachment'])
    ->name('faculty.tasks.attachment');

Route::put('/faculty/tasks/{task}', [TaskController::class, 'update'])
    ->name('faculty.tasks.update');

Route::delete('/faculty/tasks/{task}', [TaskController::class, 'destroy'])
    ->name('faculty.tasks.destroy');

Route::resource('tasks', TaskController::class)->except(['create', 'edit']);
