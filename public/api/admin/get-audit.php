<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Content-Type: application/json");
$file = __DIR__ . "/../../../../data/audit.json";
if (!file_exists($file)) { echo "[]"; exit; }
$logs = json_decode(file_get_contents($file), true);
echo json_encode(array_reverse($logs ?? []));
