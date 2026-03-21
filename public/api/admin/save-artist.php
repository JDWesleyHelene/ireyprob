<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/../db/connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) jsonOut(['error' => 'Invalid JSON'], 400);

// Handle delete
if (($data['_action'] ?? '') === 'delete') {
    try {
        getDB()->prepare("DELETE FROM artists WHERE id=?")->execute([$data['id']]);
        auditLog('delete', 'Artist', $data['id']);
        jsonOut(['success' => true]);
    } catch (Exception $e) {
        // Fallback JSON
        $file = __DIR__ . '/../../../../data/artists.json';
        $arr = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        $arr = array_values(array_filter($arr, fn($a) => $a['id'] !== $data['id']));
        file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT));
        jsonOut(['success' => true]);
    }
    exit;
}

if (empty($data['name'])) jsonOut(['error' => 'Name required'], 400);

$id   = $data['id'] ?? uniqid('artist_');
$slug = $data['slug'] ?: strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($data['name'])));
$tags = json_encode($data['tags'] ?? []);

try {
    $db = getDB();
    $db->prepare("INSERT INTO artists (id,name,slug,genre,origin,bio,image,image_alt,tags,featured,sort_order)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE name=VALUES(name),slug=VALUES(slug),genre=VALUES(genre),
                  origin=VALUES(origin),bio=VALUES(bio),image=VALUES(image),image_alt=VALUES(image_alt),
                  tags=VALUES(tags),featured=VALUES(featured)")
        ->execute([$id,$data['name'],$slug,$data['genre']??'',$data['origin']??'',$data['bio']??'',
                   $data['image']??'',$data['image_alt']??'',$tags,$data['featured']?1:0, $data['sort_order']??0]);
    auditLog(isset($data['id']) ? 'update' : 'create', 'Artist', $data['name']);
    jsonOut(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    // Fallback JSON
    $dir = __DIR__ . '/../../../../data';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $file = "$dir/artists.json";
    $arr = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $new = ['id'=>$id,'name'=>$data['name'],'slug'=>$slug,'genre'=>$data['genre']??'','origin'=>$data['origin']??'','bio'=>$data['bio']??'','image'=>$data['image']??'','image_alt'=>$data['image_alt']??'','tags'=>$data['tags']??[],'featured'=>$data['featured']??false,'sort_order'=>count($arr)+1];
    $found = false;
    foreach ($arr as &$a) { if ($a['id'] === $id) { $a = $new; $found = true; break; } }
    if (!$found) $arr[] = $new;
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    jsonOut(['success' => true, 'id' => $id, 'fallback' => 'json']);
}
