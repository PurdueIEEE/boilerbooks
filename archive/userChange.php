<?php
session_start();
include 'dbinfo.php';

// define variables and set to empty values

$usr = "";

$usr = test_input($_GET["usr"]);



if (($_SESSION['user']) == 'master') {
	$_SESSION['user'] = $usr;
}

header("Location: /loggedin.php");
?>
