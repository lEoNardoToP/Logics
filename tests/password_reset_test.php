<?php
declare(strict_types=1);
// Runs PasswordDimenticata.php and ResetPassword.php as separate PHP processes against
// a temporary SQLite database, with email captured to a file instead of sent.
// Usage: php tests/password_reset_test.php   (exit 0 = all checks passed)

$root = dirname(__DIR__);
$sandbox = sys_get_temp_dir() . '/logics-reset-' . bin2hex(random_bytes(4));
mkdir($sandbox);
copy("$root/PasswordDimenticata.php", "$sandbox/PasswordDimenticata.php");
copy("$root/ResetPassword.php", "$sandbox/ResetPassword.php");
$db = "$sandbox/test.sqlite";
$mailLog = "$sandbox/mail.log";
file_put_contents("$sandbox/connection.php", "<?php\n\$pdo = new PDO('sqlite:$db', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);\n");
file_put_contents("$sandbox/SendEmail.php", "<?php\nfunction send_email(string \$to, string \$title, string \$body): bool { file_put_contents('$mailLog', json_encode(['to' => \$to, 'body' => \$body]) . \"\\n\", FILE_APPEND); return true; }\n");

$pdo = new PDO("sqlite:$db", null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$pdo->exec("CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, password TEXT, email TEXT, status TEXT, verified INT)");
$pdo->exec("CREATE TABLE password_resets (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, new_password_hash TEXT NOT NULL, expires_at TEXT NOT NULL, used INT NOT NULL DEFAULT 0)");
$pdo->prepare("INSERT INTO users VALUES ('u1', 'leo', ?, 'leo@example.com', 'ok', 1)")
    ->execute([password_hash('old-password', PASSWORD_BCRYPT)]);

$failures = 0;
function check(bool $ok, string $what): void {
  global $failures;
  echo ($ok ? "PASS " : "FAIL ") . $what . "\n";
  if (!$ok) { $failures++; }
}
function run(string $sandbox, string $script, array $post = [], array $get = []): array {
  $prelude = '$_POST = ' . var_export($post, true) . '; $_GET = ' . var_export($get, true) . ';';
  $cmd = 'cd ' . escapeshellarg($sandbox) . ' && php -d display_errors=stderr -r '
       . escapeshellarg($prelude . ' include "' . $script . '";') . ' 2>&1';
  exec($cmd, $out, $code);
  return [implode("\n", $out), $code];
}
function currentHash(PDO $pdo): string {
  return (string) $pdo->query("SELECT password FROM users WHERE id = 'u1'")->fetchColumn();
}
function lastToken(string $mailLog): ?string {
  if (!is_file($mailLog)) { return null; }
  $lines = file($mailLog, FILE_IGNORE_NEW_LINES);
  $mail = json_decode(end($lines), true);
  return preg_match('/token=([0-9a-f]{64})/', $mail['body'], $m) ? $m[1] : null;
}

// 1. Request for an existing account: one email with a token, no password anywhere.
[$out] = run($sandbox, 'PasswordDimenticata.php', ['email' => 'leo@example.com', 'password' => 'new-secret-123']);
$token = lastToken($mailLog);
check($token !== null, 'reset email carries a 64-hex token');
check(!str_contains((string) file_get_contents($mailLog), 'new-secret-123'), 'new password never appears in the email');
$row = $pdo->query("SELECT * FROM password_resets")->fetch();
check($row && $row['token_hash'] === hash('sha256', (string) $token) && $row['token_hash'] !== $token, 'only the token hash is stored');
check($row && password_verify('new-secret-123', $row['new_password_hash']), 'new password stored only as bcrypt');
check(password_verify('old-password', currentHash($pdo)), 'password unchanged before the link is used');

// 2. Unknown email: same response, no email, no row.
$mailsBefore = count(file($mailLog));
[$outUnknown] = run($sandbox, 'PasswordDimenticata.php', ['email' => 'nobody@example.com', 'password' => 'x']);
check($outUnknown === $out, 'same response for unknown and known email');
check(count(file($mailLog)) === $mailsBefore, 'no email for an unknown address');

// 3. Wrong and malformed tokens are refused and change nothing.
[$o] = run($sandbox, 'ResetPassword.php', [], ['token' => str_repeat('a', 64)]);
check(str_contains($o, 'non valido'), 'unknown token refused');
[$o] = run($sandbox, 'ResetPassword.php', [], ['token' => "' OR 1=1 --"]);
check(str_contains($o, 'non valido'), 'malformed token refused');
check(password_verify('old-password', currentHash($pdo)), 'password still unchanged');

// 4. The valid token applies the new password once.
run($sandbox, 'ResetPassword.php', [], ['token' => $token]);
check(password_verify('new-secret-123', currentHash($pdo)), 'valid token applies the new password');
[$o] = run($sandbox, 'ResetPassword.php', [], ['token' => $token]);
check(str_contains($o, 'non valido'), 'token cannot be reused');

// 5. A newer request invalidates an older link; expired links are refused.
run($sandbox, 'PasswordDimenticata.php', ['email' => 'leo@example.com', 'password' => 'second-pass']);
$first = lastToken($mailLog);
run($sandbox, 'PasswordDimenticata.php', ['email' => 'leo@example.com', 'password' => 'third-pass']);
$second = lastToken($mailLog);
[$o] = run($sandbox, 'ResetPassword.php', [], ['token' => $first]);
check(str_contains($o, 'non valido') && password_verify('new-secret-123', currentHash($pdo)), 'older link invalidated by a newer request');
$pdo->exec("UPDATE password_resets SET expires_at = '2000-01-01 00:00:00'");
[$o] = run($sandbox, 'ResetPassword.php', [], ['token' => $second]);
check(str_contains($o, 'non valido') && password_verify('new-secret-123', currentHash($pdo)), 'expired link refused');

// 6. Validation messages keep the fields the frontend reads.
[$o] = run($sandbox, 'PasswordDimenticata.php', ['email' => 'not-an-email', 'password' => 'x']);
check(json_decode($o, true)['failedEmail'] === 'Email non valida', 'invalid email reported in failedEmail');

array_map('unlink', glob("$sandbox/*"));
rmdir($sandbox);
echo $failures === 0 ? "ALL PASSED\n" : "$failures FAILED\n";
exit($failures === 0 ? 0 : 1);
