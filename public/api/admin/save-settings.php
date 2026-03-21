<?php
require_once __DIR__ . '/../db/connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) jsonOut(['error' => 'Invalid JSON'], 400);

try {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_val) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_val=VALUES(setting_val), updated_at=NOW()");
    foreach ($data as $key => $val) {
        if (!str_starts_with($key, '_')) $stmt->execute([$key, $val]);
    }
    auditLog('update', 'Settings', 'Site settings updated');
    jsonOut(['success' => true]);
} catch (Exception $e) {
    // Fallback: save to JSON file
    $dir = __DIR__ . '/../../../../data';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $file = "$dir/settings.json";
    $existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    file_put_contents($file, json_encode(array_merge($existing ?? [], $data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    jsonOut(['success' => true, 'fallback' => 'json']);
}
