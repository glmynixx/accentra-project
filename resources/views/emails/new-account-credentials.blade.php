<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your ACCENTRA account</title>
</head>
<body>
    <p>Hello {{ $name }},</p>
    <p>An ACCENTRA {{ strtolower($accountType) }} account has been created for you.</p>
    <p>Your login username is <strong>{{ $loginId }}</strong>.</p>
    <p>Account details:</p>
    <ul>
        @foreach ($accountDetails as $label => $value)
            @if ($value !== null && $value !== '')
                <li><strong>{{ $label }}:</strong> {{ $value }}</li>
            @endif
        @endforeach
    </ul>
    <p>Create your password using the secure, one-time link below:</p>
    <p><a href="{{ $setupUrl }}">Create your password</a></p>
    <p>This link expires in 60 minutes and can only be used once. If you did not expect this account, you can ignore this email.</p>
</body>
</html>
