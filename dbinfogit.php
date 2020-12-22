<?php
  session_start();
  $servername = "";
  $username = "";
  $password = "";
  $dbname = "";
  $uploadcode = "";

  $sendemail = 1; // change to 0 if you want to disable email alerts. Otherwise 1

  function test_input($data) {
    $data = str_replace('/','-',$data);
    $data = str_replace('&','-',$data);
    $data = str_replace('"','',$data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
    return $data;
  }

  function test_input2($data) { //used when / needs to be used
    //$data = str_replace('/','-',$data);
    $data = str_replace('&','-',$data);
    $data = str_replace('"','',$data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
    return $data;
  }

  $conn = null;

  include 'fiscal-year.php';
  $current_fiscal_year = $fiscal_year_file;
  $first_fiscal_year = $first_fiscal_year_file;
  $year_options_select = $year_options_file;
?>
