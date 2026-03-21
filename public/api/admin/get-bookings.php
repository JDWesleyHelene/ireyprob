<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Content-Type: application/json");
$file = __DIR__ . "/../../../../data/bookings.json";
if (!file_exists($file)) { echo "[]"; exit; }
echo file_get_contents($file);
