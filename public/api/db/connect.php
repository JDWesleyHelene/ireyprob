<?php
// Load .env.php — try multiple possible locations
$candidates = [
    '/home/ireyprod/.env.php',                          // absolute path (most reliable)
    __DIR__ . '/../../../../.env.php',                  // relative: public/api/db → project root → home
    __DIR__ . '/../../../../../.env.php',               // one level deeper
    dirname($_SERVER['DOCUMENT_ROOT']) . '/.env.php',   // home dir via DOCUMENT_ROOT
];
foreach ($candidates as $f) {
    if (file_exists($f)) { require_once $f; break; }
}

// Credentials — read from env, with your actual DB as fallback
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'ireyprod_ireyprod');
define('DB_USER', getenv('DB_USER') ?: 'ireyprod_ireyprod');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME),
        DB_USER, DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
    return $pdo;
}

function jsonOut(mixed $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function auditLog(string $action, string $resource, string $details = ''): void {
    try {
        getDB()->prepare('INSERT INTO audit_log (action, resource, details) VALUES (?,?,?)')
               ->execute([$action, $resource, $details]);
    } catch (Throwable $e) { /* non-fatal */ }
}
