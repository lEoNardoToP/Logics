<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

/**
 * Send an application email. SMTP credentials must be configured in the
 * deployment environment; no credentials belong in source control.
 */
function send_email(string $to, string $title, string $body): bool
{
    $host = getenv('SMTP_HOST');
    $username = getenv('SMTP_USERNAME');
    $password = getenv('SMTP_PASSWORD');
    $from = getenv('SMTP_FROM_EMAIL');

    if (!$host || !$username || !$password || !$from) {
        error_log('SMTP is not configured: required environment variables are missing.');
        return false;
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        $mail->Password = $password;
        $port = (int) (getenv('SMTP_PORT') ?: 465);
        $mail->Port = $port;
        $mail->SMTPSecure = $port === 587
            ? PHPMailer::ENCRYPTION_STARTTLS
            : PHPMailer::ENCRYPTION_SMTPS;
        $mail->CharSet = 'UTF-8';
        $mail->setFrom($from, getenv('SMTP_FROM_NAME') ?: 'Logics');
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $title;
        $mail->Body = $body;
        $mail->AltBody = trim(strip_tags($body));
        return $mail->send();
    } catch (MailException $e) {
        error_log('Email delivery failed.');
        return false;
    }
}
