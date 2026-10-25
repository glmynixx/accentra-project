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
    <p>Your login email is <strong>{{ $email }}</strong>. Set your password using the link below:</p>
    <p><a href="{{ $setupUrl }}">Create your password</a></p>
    <p>This link expires in 60 minutes and can only be used once. If you did not expect this account, you can ignore this email.</p>
</body>
</html>
