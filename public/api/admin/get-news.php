<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Content-Type: application/json");
$file = __DIR__ . "/../../../../data/news.json";
if (!file_exists($file)) {
    // Bootstrap with default data if no file exists
    echo "[]"; exit;
}
echo file_get_contents($file);
