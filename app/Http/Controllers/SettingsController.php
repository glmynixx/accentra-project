<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Section;
use App\Models\Student;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SettingsController extends Controller
{
    private const GENERAL_DEFAULTS = [
        'systemName' => 'ACCENTRA',
        'schoolName' => 'ACLC COLLEGE OF MALOLOS',
        'schoolAddress' => 'Malolos, Bulacan, Philippines',
        'contactNumber' => '09952138871',
        'emailAddress' => 'aclcadmin@accentra.edu',
        'website' => 'https://www.accentra.edu.ph',
        'logoPath' => null,
    ];

    private const ACADEMIC_DEFAULTS = [
        'academicYear' => '2026-2027',
        'semester' => 'First Semester',
        'periodStatus' => 'Active',
        'defaultProgram' => 'Bachelor of Science in Accounting Information Systems',
        'yearLevels' => ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    ];

    private const PROGRAMS = [
        'Bachelor of Science in Accounting Information Systems',
        'Bachelor of Science in Entrepreneurship',
    ];

    private const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    public function general(): Response
    {
        $settings = $this->settings('general', self::GENERAL_DEFAULTS);

        return Inertia::render('generalSettings', [
            'generalSettings' => [
                ...$settings,
                'logoUrl' => $settings['logoPath']
                    ? Storage::disk('public')->url($settings['logoPath'])
                    : null,
                'updatedAt' => $this->lastUpdated('general'),
            ],
        ]);
    }

    public function updateGeneral(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'systemName' => ['required', 'string', 'max:120'],
            'schoolName' => ['required', 'string', 'max:180'],
            'schoolAddress' => ['required', 'string', 'max:255'],
            'contactNumber' => ['nullable', 'string', 'max:30'],
            'emailAddress' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'logoFile' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $setting = SystemSetting::firstOrNew(['key' => 'general']);
        $values = array_merge(
            self::GENERAL_DEFAULTS,
            $setting->value ?? [],
            collect($validated)->except('logoFile')->all(),
        );
        $values['contactNumber'] ??= '';
        $values['emailAddress'] ??= '';
        $values['website'] ??= '';

        if ($request->hasFile('logoFile')) {
            $oldLogoPath = $values['logoPath'];
            $newLogoPath = $request->file('logoFile')->store('system', 'public');

            if ($newLogoPath === false) {
                abort(500, 'The system logo could not be stored.');
            }

            $values['logoPath'] = $newLogoPath;
        }

        $setting->fill([
            'value' => $values,
            'updated_by' => $request->user()->id,
        ])->save();

        if (isset($oldLogoPath) && $oldLogoPath !== $values['logoPath']) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        return back()->with('success', 'General settings saved.');
    }

    public function academic(): Response
    {
        return Inertia::render('academicSettings', [
            'academicSettings' => $this->settings('academic', self::ACADEMIC_DEFAULTS),
            'updatedAt' => $this->lastUpdated('academic'),
        ]);
    }

    public function updateAcademic(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'academicYear' => ['required', 'regex:/^\d{4}-\d{4}$/'],
            'semester' => ['required', 'in:First Semester,Second Semester'],
            'periodStatus' => ['required', 'in:Active,Upcoming,Closed'],
            'defaultProgram' => ['required', 'string', 'in:'.implode(',', self::PROGRAMS)],
            'yearLevels' => ['required', 'array', 'min:1'],
            'yearLevels.*' => ['required', 'string', 'distinct', 'in:'.implode(',', self::YEAR_LEVELS)],
        ]);

        SystemSetting::updateOrCreate(
            ['key' => 'academic'],
            [
                'value' => $validated,
                'updated_by' => $request->user()->id,
            ],
        );

        return back()->with('success', 'Academic settings saved.');
    }

    public function information(): Response
    {
        $databaseStatus = 'Connected';
        $databaseDriver = 'Unknown';
        $statistics = [
            'totalUsers' => null,
            'totalStudents' => null,
            'totalFaculty' => null,
            'totalSections' => null,
        ];
        $generalSettings = self::GENERAL_DEFAULTS;
        $lastUpdated = 'Not available';

        try {
            $connection = DB::connection();
            $connection->select('SELECT 1');
            $databaseDriver = ucfirst($connection->getDriverName());
        } catch (Throwable $exception) {
            report($exception);
            $databaseStatus = 'Unavailable';
        }

        if ($databaseStatus === 'Connected') {
            try {
                $statistics = [
                    'totalUsers' => User::where('role', 'Admin')->count() + Student::count() + Faculty::count(),
                    'totalStudents' => Student::count(),
                    'totalFaculty' => Faculty::count(),
                    'totalSections' => Section::count(),
                ];
                $generalSettings = $this->settings('general', self::GENERAL_DEFAULTS);
                $lastUpdated = $this->lastUpdated('general', 'academic') ?? $lastUpdated;
            } catch (Throwable $exception) {
                report($exception);
                $databaseStatus = 'Unavailable';
            }
        }

        return Inertia::render('systemInformation', [
            'systemInformation' => [
                'statistics' => $statistics,
                'status' => [
                    'serverTime' => now()->toDateTimeString(),
                    'database' => $databaseStatus,
                    'server' => 'Operational',
                ],
                'version' => [
                    'systemName' => $generalSettings['systemName'],
                    'version' => '1.0.0',
                    'framework' => 'Laravel '.app()->version().' (PHP '.PHP_VERSION.')',
                    'database' => $databaseDriver,
                    'environment' => app()->environment(),
                    'lastUpdated' => $lastUpdated,
                ],
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>  $defaults
     * @return array<string, mixed>
     */
    private function settings(string $key, array $defaults): array
    {
        return array_merge(
            $defaults,
            SystemSetting::where('key', $key)->first()?->value ?? [],
        );
    }

    private function lastUpdated(string ...$keys): ?string
    {
        $setting = SystemSetting::whereIn('key', $keys)
            ->latest('updated_at')
            ->first();

        return $setting?->updated_at?->toDateTimeString();
    }
}
