<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/../db/connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) jsonOut(['error' => 'Invalid JSON'], 400);

$action = $data['_action'] ?? 'save';
$dir    = __DIR__ . '/../../../../data';

// Delete
if ($action === 'delete') {
    try {
        getDB()->prepare("DELETE FROM news WHERE id=?")->execute([$data['id']]);
        auditLog('delete', 'News', $data['id']);
        jsonOut(['success' => true]);
    } catch (Exception $e) {
        $file = "$dir/news.json";
        $arr  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        $arr  = array_values(array_filter($arr, fn($n) => $n['id'] !== $data['id']));
        file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT));
        jsonOut(['success' => true]);
    }
}

// Toggle status
if ($action === 'toggle_status') {
    try {
        $pub = $data['status'] === 'published' ? ($data['published_at'] ?? date('c')) : null;
        getDB()->prepare("UPDATE news SET status=?, published_at=? WHERE id=?")->execute([$data['status'], $pub, $data['id']]);
        jsonOut(['success' => true]);
    } catch (Exception $e) {
        $file = "$dir/news.json";
        $arr  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        foreach ($arr as &$n) { if ($n['id'] === $data['id']) { $n['status'] = $data['status']; $n['published_at'] = $data['published_at']; } }
        file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT));
        jsonOut(['success' => true]);
    }
}

// Save / update
$id   = $data['id'] ?? uniqid('news_');
$slug = $data['slug'] ?: strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($data['title'] ?? '')));
$pub  = ($data['status'] === 'published') ? ($data['published_at'] ?? date('c')) : ($data['published_at'] ?? null);
$pub  = $pub ? date('Y-m-d H:i:s', strtotime($pub)) : null;

try {
    $db = getDB();
    $db->prepare("INSERT INTO news (id,title,slug,excerpt,content,cover_image,cover_image_alt,author,status,published_at)
                  VALUES (?,?,?,?,?,?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE title=VALUES(title),slug=VALUES(slug),excerpt=VALUES(excerpt),
                  content=VALUES(content),cover_image=VALUES(cover_image),cover_image_alt=VALUES(cover_image_alt),
                  author=VALUES(author),status=VALUES(status),published_at=VALUES(published_at)")
        ->execute([$id,$data['title']??'',$slug,$data['excerpt']??'',$data['content']??'',$data['cover_image']??'',$data['cover_image_alt']??'',$data['author']??'IREY PROD',$data['status']??'draft',$pub]);
    auditLog(isset($data['id']) ? 'update' : 'create', 'News', $data['title'] ?? '');
    jsonOut(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $file = "$dir/news.json";
    $arr  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $new  = ['id'=>$id,'title'=>$data['title']??'','slug'=>$slug,'excerpt'=>$data['excerpt']??'','content'=>$data['content']??'','cover_image'=>$data['cover_image']??'','cover_image_alt'=>$data['cover_image_alt']??'','author'=>$data['author']??'IREY PROD','status'=>$data['status']??'draft','published_at'=>$data['published_at']??null,'created_at'=>date('c')];
    $found = false;
    foreach ($arr as &$n) { if ($n['id'] === $id) { $n = $new; $found = true; break; } }
    if (!$found) $arr[] = $new;
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    jsonOut(['success' => true, 'id' => $id, 'fallback' => 'json']);
}
