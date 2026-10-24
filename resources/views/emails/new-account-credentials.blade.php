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
    <p>
        Email: <strong>{{ $email }}</strong><br>
        Temporary password: <strong>{{ $password }}</strong>
    </p>
    <p>Sign in at the ACCENTRA portal. Keep this password private. If you need to change it, use the Forgot Password option on the login page.</p>
</body>
</html>
