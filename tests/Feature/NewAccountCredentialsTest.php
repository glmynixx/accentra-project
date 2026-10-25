<?php

use App\Mail\NewAccountCredentials;
use App\Models\Faculty;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportException;

function signInAsAccountAdmin(): User
{
    $admin = User::factory()->create(['role' => 'Admin']);
    test()->actingAs($admin);

    return $admin;
}

it('creates a faculty account and emails a password setup link', function () {
    Mail::fake();
    signInAsAccountAdmin();

    $this->from(route('faculty'))
        ->post(route('faculty.store'), [
            'faculty_number' => 'FAC-001',
            'name' => 'New Faculty',
            'email' => 'new.faculty@example.com',
            'specialization' => 'Accounting',
            'status' => 'Active',
        ])
        ->assertRedirect(route('faculty'));

    $faculty = Faculty::where('email', 'new.faculty@example.com')->firstOrFail();
    $user = User::where('email', $faculty->email)->firstOrFail();
    $setupUrl = null;

    Mail::assertSent(NewAccountCredentials::class, function (NewAccountCredentials $mail) use ($faculty, &$setupUrl) {
        $setupUrl = $mail->setupUrl;

        return $mail->hasTo($faculty->email)
            && $mail->accountType === 'Faculty'
            && $mail->setupUrl !== '';
    });

    expect($user->role)->toBe('Faculty')
        ->and($faculty->user_id)->toBe($user->id)
        ->and($user->password)->not->toBeEmpty();

    $token = basename(parse_url($setupUrl, PHP_URL_PATH));
    expect(DB::table('account_password_setup_tokens')
        ->where('email', $faculty->email)
        ->where('account_type', 'Faculty')
        ->value('token_hash'))->toBe(hash('sha256', $token));
});

it('creates a student account and emails a password setup link', function () {
    Mail::fake();
    signInAsAccountAdmin();

    $section = Section::create([
        'section_name' => 'BSACCT-1A',
        'course' => 'BS Accountancy',
        'year_level' => '1st Year',
        'school_year' => '2026-2027',
        'status' => 'Active',
    ]);

    $this->from(route('students'))
        ->post(route('students.store'), [
            'student_number' => 'STU-001',
            'name' => 'New Student',
            'email' => 'new.student@example.com',
            'course' => 'BS Accountancy',
            'year_level' => '1st Year',
            'section_id' => $section->id,
            'section' => $section->section_name,
            'status' => 'Active',
        ])
        ->assertRedirect(route('students'));

    $student = Student::where('email', 'new.student@example.com')->firstOrFail();
    $setupUrl = null;

    Mail::assertSent(NewAccountCredentials::class, function (NewAccountCredentials $mail) use ($student, &$setupUrl) {
        $setupUrl = $mail->setupUrl;

        return $mail->hasTo($student->email)
            && $mail->accountType === 'Student'
            && $mail->setupUrl !== ''
            && $student->password !== '';
    });

    $token = basename(parse_url($setupUrl, PHP_URL_PATH));
    expect(DB::table('account_password_setup_tokens')
        ->where('email', $student->email)
        ->where('account_type', 'Student')
        ->value('token_hash'))->toBe(hash('sha256', $token));
});

it('does not create a faculty account when the credentials email cannot be sent', function () {
    signInAsAccountAdmin();

    $pendingMail = Mockery::mock();
    $pendingMail->shouldReceive('send')
        ->once()
        ->andThrow(new TransportException('SMTP authentication failed.'));

    Mail::shouldReceive('to')
        ->once()
        ->with('new.faculty@example.com')
        ->andReturn($pendingMail);

    $this->from(route('faculty'))
        ->post(route('faculty.store'), [
            'faculty_number' => 'FAC-002',
            'name' => 'New Faculty',
            'email' => 'new.faculty@example.com',
            'specialization' => 'Accounting',
            'status' => 'Active',
        ])
        ->assertSessionHasErrors('email');

    expect(Faculty::where('faculty_number', 'FAC-002')->exists())->toBeFalse()
        ->and(User::where('email', 'new.faculty@example.com')->exists())->toBeFalse();
});

it('does not create a student account when the credentials email cannot be sent', function () {
    signInAsAccountAdmin();

    $section = Section::create([
        'section_name' => 'BSACCT-1A',
        'course' => 'BS Accountancy',
        'year_level' => '1st Year',
        'school_year' => '2026-2027',
        'status' => 'Active',
    ]);

    $pendingMail = Mockery::mock();
    $pendingMail->shouldReceive('send')
        ->once()
        ->andThrow(new TransportException('SMTP authentication failed.'));

    Mail::shouldReceive('to')
        ->once()
        ->with('new.student@example.com')
        ->andReturn($pendingMail);

    $this->from(route('students'))
        ->post(route('students.store'), [
            'student_number' => 'STU-002',
            'name' => 'New Student',
            'email' => 'new.student@example.com',
            'course' => 'BS Accountancy',
            'year_level' => '1st Year',
            'section_id' => $section->id,
            'section' => $section->section_name,
            'status' => 'Active',
        ])
        ->assertSessionHasErrors('email');

    expect(Student::where('student_number', 'STU-002')->exists())->toBeFalse();
});
