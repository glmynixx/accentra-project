<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'dashboard')->name('dashboard');

Route::inertia('/faculty', 'facultyManagement')->name('faculty');

Route::inertia('/students', 'studentManagement')->name('students');

Route::inertia('/sections', 'sectionManagement')->name('sections');