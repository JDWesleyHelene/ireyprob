<?php
header("Content-Type: application/json");
$file = __DIR__ . "/../../../../data/bookings.json";
if (!file_exists($file)) { echo "[]"; exit; }
echo file_get_contents($file);
