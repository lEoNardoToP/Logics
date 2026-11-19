<?php
declare(strict_types=1);
require_once('SendEmail.php');
require_once('connection.php');

// Password reset, step 1. The user submits email and new password; we store only a
// bcrypt hash of the new password next to the SHA-256 of a random, single-use,
// one-hour token, and email a link that carries the token alone. The password never
// appears in a URL, an email or a log. The response is the same whether or not the
// email belongs to an account, so the form cannot be used to discover accounts.
const RESET_TTL_SECONDS = 3600;

$email = trim((string) ($_POST["email"] ?? ""));
$newPassword = (string) ($_POST["password"] ?? "");
$failed_email = "";
$failed_password = "";
$canGo = true;

if ($email === "") {
  $failed_email = "Immettere l'email";
  $canGo = false;
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $failed_email = "Email non valida";
  $canGo = false;
}
if ($newPassword === "") {
  $failed_password = "Immettere la nuova password";
  $canGo = false;
}

if ($canGo) {
  $check = $pdo->prepare('SELECT id FROM users WHERE email = :email');
  $check->bindParam(':email', $email, PDO::PARAM_STR);
  $check->execute();
  $user = $check->fetch();

  if ($user) {
    $token = bin2hex(random_bytes(32));
    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $expires = $now->modify('+' . RESET_TTL_SECONDS . ' seconds')->format('Y-m-d H:i:s');

    $pdo->beginTransaction();
    // One outstanding link per account: a new request invalidates older ones.
    $pdo->prepare('DELETE FROM password_resets WHERE user_id = :uid')
        ->execute([':uid' => $user["id"]]);
    $pdo->prepare('INSERT INTO password_resets (token_hash, user_id, new_password_hash, expires_at, used)
                   VALUES (:hash, :uid, :pwd, :exp, 0)')
        ->execute([
          ':hash' => hash('sha256', $token),
          ':uid' => $user["id"],
          ':pwd' => password_hash($newPassword, PASSWORD_BCRYPT),
          ':exp' => $expires,
        ]);
    $pdo->commit();

    $base = rtrim(getenv('APP_BASE_URL') ?: 'http://localhost/Logics', '/');
    $link = htmlspecialchars($base . '/ResetPassword.php?token=' . $token, ENT_QUOTES, 'UTF-8');
    send_email($email, "LOGICS: conferma il cambio password",
      '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8" /><title>Logics</title></head><body>'
      . '<p>Hai chiesto di cambiare la password del tuo account Logics.</p>'
      . '<p><a href="' . $link . '">Conferma il cambio password</a> (valido per un\'ora, una sola volta).</p>'
      . '<p>Se non sei stato tu, ignora questa email: la password resta invariata.</p></body></html>');
  }
}

echo json_encode([
  "failedEmail" => $failed_email,
  "failedPassword" => $failed_password,
]);
