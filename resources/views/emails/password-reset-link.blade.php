<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset your ACCENTRA password</title>
</head>
<body>
    <p>Hello {{ $name }},</p>
    <p>We received a request to reset the password for your ACCENTRA {{ strtolower($accountType) }} account.</p>
    <p><a href="{{ $resetUrl }}">Set a new password</a></p>
    <p>This link expires in 60 minutes and can only be used once. If you did not request a password reset, you can ignore this email.</p>
</body>
</html>
