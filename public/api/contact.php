<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$name      = htmlspecialchars(trim($data['name'] ?? ''));
$email     = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$budget    = htmlspecialchars(trim($data['budget'] ?? ''));
$timeframe = htmlspecialchars(trim($data['timeframe'] ?? ''));
$project   = htmlspecialchars(trim($data['project'] ?? ''));

if (!$name || !$email || !$project) { http_response_code(422); echo json_encode(['error' => 'Missing fields']); exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(['error' => 'Invalid email']); exit; }

// 1. Try MySQL
$saved = false;
try {
    require_once __DIR__ . '/db/connect.php';
    getDB()->prepare("INSERT INTO contact_submissions (name,email,budget,timeframe,project) VALUES (?,?,?,?,?)")
           ->execute([$name, $email, $budget, $timeframe, $project]);
    auditLog('create', 'Contact', "$name <$email>");
    $saved = true;
} catch (Exception $e) {
    // 2. Fallback: JSON file
    $dir  = __DIR__ . '/../../data';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $file = "$dir/contacts.json";
    $arr  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $arr[] = ['id'=>count($arr)+1,'name'=>$name,'email'=>$email,'budget'=>$budget,'timeframe'=>$timeframe,'project'=>$project,'created_at'=>date('c')];
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    $saved = true;
}

// Get contact email from settings
$toEmail = 'booking@ireyprod.com';
try {
    require_once __DIR__ . '/db/connect.php';
    $row = getDB()->query("SELECT setting_val FROM settings WHERE setting_key='contact_email'")->fetch();
    if ($row) $toEmail = $row['setting_val'];
} catch (Exception $e) {
    $settingsFile = __DIR__ . '/../../data/settings.json';
    if (file_exists($settingsFile)) {
        $settings = json_decode(file_get_contents($settingsFile), true);
        if (!empty($settings['contact_email'])) $toEmail = $settings['contact_email'];
    }
}

// Send emails
$headers = "From: noreply@ireyprod.com\r\nReply-To: $email\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8";
mail($toEmail, "New Contact Enquiry from $name",
    "Name: $name\nEmail: $email\nBudget: $budget\nTimeframe: $timeframe\n\nProject:\n$project", $headers);
mail($email, "We received your enquiry — IREY PROD",
    "Hi $name,\n\nThank you for reaching out to IREY PROD.\nWe'll get back to you within 48 hours.\n\nBest,\nIREY PROD Team",
    "From: $toEmail");

echo json_encode(['success' => true]);
