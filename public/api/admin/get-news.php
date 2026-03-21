<?php
header("Content-Type: application/json");
$file = __DIR__ . "/../../../../data/news.json";
if (!file_exists($file)) {
    // Bootstrap with default data if no file exists
    echo "[]"; exit;
}
echo file_get_contents($file);
