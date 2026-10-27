<?php

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('requires admin authentication for settings pages', function () {
    foreach ([
        '/settings/general',
        '/settings/academic',
        '/settings/information',
    ] as $path) {
        $this->get($path)->assertRedirect(route('login'));
    }
});

it('renders the settings pages for an admin', function () {
    $admin = User::factory()->create(['role' => 'Admin']);

    foreach ([
        '/settings/general' => 'generalSettings',
        '/settings/academic' => 'academicSettings',
        '/settings/information' => 'systemInformation',
    ] as $path => $component) {
        $this->actingAs($admin)
            ->get($path)
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }
});

it('persists general settings and uploads the system logo', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'Admin']);

    $this->actingAs($admin)
        ->post('/settings/general', [
            'systemName' => 'ACCENTRA SIS',
            'schoolName' => 'ACLC COLLEGE',
            'schoolAddress' => 'Malolos, Bulacan',
            'contactNumber' => '09123456789',
            'emailAddress' => 'admin@example.com',
            'website' => 'https://example.com',
            'logoFile' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertSessionHasNoErrors();

    $settings = SystemSetting::where('key', 'general')->firstOrFail();

    expect($settings->value['systemName'])->toBe('ACCENTRA SIS')
        ->and($settings->updated_by)->toBe($admin->id)
        ->and(Storage::disk('public')->exists($settings->value['logoPath']))->toBeTrue();

    $this->get('/settings/general')
        ->assertInertia(fn ($page) => $page
            ->where('generalSettings.systemName', 'ACCENTRA SIS')
            ->where('generalSettings.logoUrl', Storage::disk('public')->url($settings->value['logoPath'])));
});

it('persists academic settings and rejects invalid academic years', function () {
    $admin = User::factory()->create(['role' => 'Admin']);
    $payload = [
        'academicYear' => '2027-2028',
        'semester' => 'Second Semester',
        'periodStatus' => 'Upcoming',
        'defaultProgram' => 'Bachelor of Science in Entrepreneurship',
        'yearLevels' => ['1st Year', '3rd Year'],
    ];

    $this->actingAs($admin)
        ->post('/settings/academic', $payload)
        ->assertSessionHasNoErrors();

    expect(SystemSetting::where('key', 'academic')->firstOrFail()->value)
        ->toMatchArray($payload);

    $this->get('/settings/academic')
        ->assertInertia(fn ($page) => $page
            ->where('academicSettings.academicYear', '2027-2028'));

    $this->get('/sections')
        ->assertInertia(fn ($page) => $page
            ->where('academicSettings.academicYear', '2027-2028')
            ->where('academicSettings.defaultProgram', $payload['defaultProgram'])
            ->where('academicSettings.yearLevels', $payload['yearLevels']));

    $this->post('/settings/academic', [
        ...$payload,
        'academicYear' => 'not-a-school-year',
    ])->assertSessionHasErrors('academicYear');
});

it('returns live system statistics and health information', function () {
    $admin = User::factory()->create(['role' => 'Admin']);

    $this->actingAs($admin)
        ->get('/settings/information')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('systemInformation')
            ->where('systemInformation.statistics.totalUsers', 1)
            ->where('systemInformation.status.server', 'Operational')
            ->where('systemInformation.status.database', 'Connected')
            ->where('systemInformation.version.environment', 'testing'));
});
