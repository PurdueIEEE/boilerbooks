<?php
session_start();
if (!isset($_SESSION['user']))
{
    header("Location: ../index.php");
    die();
}
?>

<?php
include '../dbinfo.php';

$validuser = '';
$usr = $_SESSION['user'];


?>
