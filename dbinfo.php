<?php
session_start();
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
  return $data;
}

$conn = null;

?>
