<?php
session_start();
$servername = "";
$username = "";
$password = "";
$dbname = "";
$uploadcode = "";

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
  return $data;
}

$conn = null;

?>
