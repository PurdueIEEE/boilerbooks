<?php
session_start();
$servername = "";
$username = "";
$password = "";
$dbname = "";
$uploadcode = "";

$sendemail = 1;

function test_input($data) {
  $data = str_replace('/','-',$data);
  $data = str_replace('&','-',$data);
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
  return $data;
}

function test_input2($data) { //used when / needs to be used
  //$data = str_replace('/','-',$data);
  $data = str_replace('&','-',$data);
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
  return $data;
}

$conn = null;

?>
