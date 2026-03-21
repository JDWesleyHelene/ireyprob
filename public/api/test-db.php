<?php
/**
 * DB Connection Test — DELETE THIS FILE AFTER CONFIRMING CONNECTION
 * Visit: https://new.ireyprod.com/api/test-db.php
 */
header('Content-Type: application/json');

require_once __DIR__ . '/db/connect.php';

$result = [
    'env_php_loaded' => false,
    'db_host'        => DB_HOST,
    'db_name'        => DB_NAME,
    'db_user'        => DB_USER,
    'connected'      => false,
    'tables'         => [],
    'settings_count' => 0,
    'error'          => null,
];

// Check if .env.php was loaded
$result['env_php_loaded'] = (getenv('DB_PASS') !== false && getenv('DB_PASS') !== '');

try {
    $db = getDB();
    $result['connected'] = true;

    // List tables
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $result['tables'] = $tables;

    // Count settings
    $result['settings_count'] = (int)$db->query("SELECT COUNT(*) FROM settings")->fetchColumn();

    $result['status'] = '✅ Database connected successfully!';
} catch (Throwable $e) {
    $result['error']  = $e->getMessage();
    $result['status'] = '❌ Database connection failed';
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
