<?php
declare(strict_types=1);

// Configure these values in the deployment environment, never in Git.
// The application fails closed when required credentials are missing.
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = (int) (getenv('DB_PORT') ?: '3306');
$name = getenv('DB_NAME');
$user = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

if (!$name || !$user || $password === false || $password === '') {
    error_log('Database environment configuration is incomplete.');
    http_response_code(503);
    exit('Database is not configured.');
}

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $name);
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    error_log('Database connection failed.');
    http_response_code(503);
    exit('Service temporarily unavailable.');
}
