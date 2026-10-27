<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewAccountCredentials extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $accountType,
        public string $setupUrl,
        public string $loginId,
        public array $accountDetails,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Create your ACCENTRA '.$this->accountType.' password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-account-credentials',
        );
    }
}
