<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin
Route::inertia('/login', 'login')->name('login');

Route::inertia('/admin', 'dashboard')->name('dashboard');

Route::inertia('/faculty', 'facultyManagement')->name('faculty');

Route::inertia('/students', 'studentManagement')->name('students');

Route::inertia('/sections', 'sectionManagement')->name('sections');

Route::inertia('/forgot-password', 'forgotPassword')
    ->name('password.request');

// Faculty
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

// Student Authentication
Route::inertia('/student/login', 'studentLogin')
    ->name('student.login');

Route::inertia('/student/forgot-password', 'studentForgotPassword')
    ->name('student.forgot-password');

// Student Dashboard
Route::inertia('/student/dashboard', 'studentDashboard')
    ->name('student.dashboard');

// Student Pages
// Route::inertia('/student/sections', 'studentSections')
 //   ->name('student.sections');

Route::inertia('/student/content', 'studentContent')
    ->name('student.content');

Route::inertia('/student/tasks', 'studentTasks')
    ->name('student.tasks');

// Student Accounting Modules
Route::inertia('/student/accounting/chart-of-accounts', 'studentChartOfAccounts')
    ->name('student.accounting.chart-of-accounts');

Route::inertia('/student/accounting/journal-entries', 'studentJournalEntries')
    ->name('student.accounting.journal-entries');

Route::inertia('/student/accounting/general-ledger', 'studentGeneralLedger')
    ->name('student.accounting.general-ledger');

Route::inertia('/student/accounting/trial-balance', 'studentTrialBalance')
    ->name('student.accounting.trial-balance');

Route::inertia('/student/accounting/income-sheet', 'studentIncomeSheet')
    ->name('student.accounting.income-sheet');

Route::inertia('/student/accounting/balance-sheet', 'studentBalanceSheet')
    ->name('student.accounting.balance-sheet');

// Student Submissions and Results
Route::inertia('/student/submissions', 'studentSubmissions')
    ->name('student.submissions');

Route::inertia('/student/results', 'studentResults')
    ->name('student.results');

// Student Account
Route::inertia('/student/account', 'studentAccount')
    ->name('student.account');

 Route::inertia('/faculty/sections', 'facultySections')
    ->name('faculty.sections');

Route::inertia('/faculty/submissions', 'facultySubmissions')
    ->name('faculty.submissions');

Route::inertia('/faculty/my-account', 'facultyMyAccount')
    ->name('faculty.my-account');

 Route::get('/', function () {
    return Inertia::render('landingPage');
});   