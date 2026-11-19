<?php
declare(strict_types=1);
require_once("connection.php");

// Password reset, step 2. Applies the stored password hash for a valid, unused,
// unexpired token, then marks the token used. Any other token gets the same 400.
$token = (string) ($_GET["token"] ?? "");
if (!preg_match('/^[0-9a-f]{64}$/', $token)) {
  http_response_code(400);
  exit('Link non valido o scaduto.');
}

$now = (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d H:i:s');
$pdo->beginTransaction();
$find = $pdo->prepare('SELECT user_id, new_password_hash FROM password_resets
                       WHERE token_hash = :hash AND used = 0 AND expires_at > :now');
$find->execute([':hash' => hash('sha256', $token), ':now' => $now]);
$reset = $find->fetch();
if (!$reset) {
  $pdo->rollBack();
  http_response_code(400);
  exit('Link non valido o scaduto.');
}

// Claim the token first so a concurrent second click cannot apply it twice.
$claim = $pdo->prepare('UPDATE password_resets SET used = 1 WHERE token_hash = :hash AND used = 0');
$claim->execute([':hash' => hash('sha256', $token)]);
if ($claim->rowCount() !== 1) {
  $pdo->rollBack();
  http_response_code(400);
  exit('Link non valido o scaduto.');
}
$pdo->prepare('UPDATE users SET password = :password WHERE id = :id')
    ->execute([':password' => $reset["new_password_hash"], ':id' => $reset["user_id"]]);
$pdo->commit();

$base = rtrim(getenv('APP_BASE_URL') ?: 'http://localhost/Logics', '/');
header("Location: " . $base . "/HomePage.html");
