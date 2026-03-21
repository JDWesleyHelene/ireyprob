<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/../db/connect.php';
try {
    $rows = getDB()->query("SELECT setting_key, setting_val FROM settings")->fetchAll();
    $out = [];
    foreach ($rows as $r) $out[$r['setting_key']] = $r['setting_val'];
    jsonOut($out);
} catch (Exception $e) {
    // Fallback to JSON file
    $file = __DIR__ . '/../../../../data/settings.json';
    echo file_exists($file) ? file_get_contents($file) : '{}';
}
