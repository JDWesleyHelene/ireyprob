<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$artistName = htmlspecialchars(trim($data['artist_name'] ?? ''));
$fullName   = htmlspecialchars(trim($data['fullName'] ?? ''));
$email      = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$address    = htmlspecialchars(trim($data['address'] ?? ''));
$dateTime   = htmlspecialchars(trim($data['dateTime'] ?? ''));
$message    = htmlspecialchars(trim($data['message'] ?? ''));

if (!$fullName || !$email || !$address || !$dateTime || !$artistName) { http_response_code(422); echo json_encode(['error' => 'Missing fields']); exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(['error' => 'Invalid email']); exit; }

$dt = !empty($dateTime) ? date('Y-m-d H:i:s', strtotime($dateTime)) : null;

// 1. Try MySQL
try {
    require_once __DIR__ . '/db/connect.php';
    getDB()->prepare("INSERT INTO booking_submissions (artist_name,full_name,email,address,date_time,message) VALUES (?,?,?,?,?,?)")
           ->execute([$artistName, $fullName, $email, $address, $dt, $message]);
    auditLog('create', 'Booking', "$fullName → $artistName");
} catch (Exception $e) {
    // 2. Fallback: JSON file
    $dir  = __DIR__ . '/../../data';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $file = "$dir/bookings.json";
    $arr  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $arr[] = ['id'=>count($arr)+1,'artist_name'=>$artistName,'full_name'=>$fullName,'email'=>$email,'address'=>$address,'date_time'=>$dateTime,'message'=>$message,'created_at'=>date('c')];
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Get contact email
$toEmail = 'booking@ireyprod.com';
try {
    require_once __DIR__ . '/db/connect.php';
    $row = getDB()->query("SELECT setting_val FROM settings WHERE setting_key='contact_email'")->fetch();
    if ($row) $toEmail = $row['setting_val'];
} catch (Exception $e) {}

$headers = "From: noreply@ireyprod.com\r\nReply-To: $email";
mail($toEmail, "Booking Request: $artistName — $fullName",
    "Artist: $artistName\nClient: $fullName\nEmail: $email\nVenue: $address\nDate: $dateTime\n\nInfo:\n$message", $headers);
mail($email, "Booking Request Received — IREY PROD",
    "Hi $fullName,\n\nYour booking request for $artistName has been received.\nWe'll be in touch within 48 hours.\n\nIREY PROD Team",
    "From: $toEmail");

echo json_encode(['success' => true]);
