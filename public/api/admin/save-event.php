<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/../db/connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) jsonOut(['error' => 'Invalid JSON'], 400);

if (($data['_action'] ?? '') === 'delete') {
    try {
        getDB()->prepare("DELETE FROM events WHERE id=?")->execute([$data['id']]);
        auditLog('delete', 'Event', $data['id']);
        jsonOut(['success' => true]);
    } catch (Exception $e) {
        $file = __DIR__ . '/../../../../data/events.json';
        $arr = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        $arr = array_values(array_filter($arr, fn($e) => $e['id'] !== $data['id']));
        file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT));
        jsonOut(['success' => true]);
    }
    exit;
}

if (empty($data['title'])) jsonOut(['error' => 'Title required'], 400);

$id   = $data['id'] ?? uniqid('event_');
$slug = $data['slug'] ?: strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($data['title'])));
$artists = json_encode($data['artists'] ?? []);
$dt   = !empty($data['event_date']) ? date('Y-m-d H:i:s', strtotime($data['event_date'])) : null;

try {
    $db = getDB();
    $db->prepare("INSERT INTO events (id,title,slug,event_date,venue,city,country,genre,image,image_alt,description,artists,featured,sold_out)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE title=VALUES(title),slug=VALUES(slug),event_date=VALUES(event_date),
                  venue=VALUES(venue),city=VALUES(city),country=VALUES(country),genre=VALUES(genre),
                  image=VALUES(image),image_alt=VALUES(image_alt),description=VALUES(description),
                  artists=VALUES(artists),featured=VALUES(featured),sold_out=VALUES(sold_out)")
        ->execute([$id,$data['title'],$slug,$dt,$data['venue']??'',$data['city']??'',$data['country']??'Mauritius',
                   $data['genre']??'',$data['image']??'',$data['image_alt']??'',$data['description']??'',$artists,
                   $data['featured']?1:0,$data['sold_out']?1:0]);
    auditLog(isset($data['id']) ? 'update' : 'create', 'Event', $data['title']);
    jsonOut(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    $dir = __DIR__ . '/../../../../data';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $file = "$dir/events.json";
    $arr = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $new = ['id'=>$id,'title'=>$data['title'],'slug'=>$slug,'event_date'=>$data['event_date']??'','venue'=>$data['venue']??'','city'=>$data['city']??'','country'=>$data['country']??'Mauritius','genre'=>$data['genre']??'','image'=>$data['image']??'','image_alt'=>$data['image_alt']??'','description'=>$data['description']??'','artists'=>$data['artists']??[],'featured'=>$data['featured']??false,'sold_out'=>$data['sold_out']??false];
    $found = false;
    foreach ($arr as &$e) { if ($e['id'] === $id) { $e = $new; $found = true; break; } }
    if (!$found) $arr[] = $new;
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    jsonOut(['success' => true, 'id' => $id, 'fallback' => 'json']);
}
