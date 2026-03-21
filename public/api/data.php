<?php
require_once __DIR__ . '/db/connect.php';
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');

$type = $_GET['type'] ?? 'all';

try {
    $db = getDB();
    switch ($type) {
        case 'artists':
            $rows = $db->query("SELECT * FROM artists ORDER BY sort_order, created_at")->fetchAll();
            foreach ($rows as &$r) { $r['tags'] = json_decode($r['tags'] ?? '[]'); $r['featured'] = (bool)$r['featured']; }
            jsonOut($rows);

        case 'events':
            $rows = $db->query("SELECT * FROM events ORDER BY event_date ASC")->fetchAll();
            foreach ($rows as &$r) { $r['artists'] = json_decode($r['artists'] ?? '[]'); $r['featured'] = (bool)$r['featured']; $r['sold_out'] = (bool)$r['sold_out']; }
            jsonOut($rows);

        case 'news':
            $rows = $db->query("SELECT * FROM news WHERE status='published' ORDER BY published_at DESC")->fetchAll();
            jsonOut($rows);

        case 'news_all':
            $rows = $db->query("SELECT * FROM news ORDER BY created_at DESC")->fetchAll();
            jsonOut($rows);

        case 'settings':
            $rows = $db->query("SELECT setting_key, setting_val FROM settings")->fetchAll();
            $out = [];
            foreach ($rows as $r) $out[$r['setting_key']] = $r['setting_val'];
            jsonOut($out);

        case 'bookings':
            $rows = $db->query("SELECT * FROM booking_submissions ORDER BY created_at DESC")->fetchAll();
            jsonOut($rows);

        case 'contacts':
            $rows = $db->query("SELECT * FROM contact_submissions ORDER BY created_at DESC")->fetchAll();
            jsonOut($rows);

        default:
            jsonOut(['error' => 'Unknown type'], 400);
    }
} catch (Exception $e) {
    // DB not available — return empty so frontend uses static fallback
    jsonOut([]);
}
