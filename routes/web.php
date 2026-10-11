<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'login')->name('login');

Route::inertia('/', 'dashboard')->name('dashboard');

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

