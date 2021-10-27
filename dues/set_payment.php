<?php
/*
 * This pages handles a committee chair adding a member to their committe who is
 *  already in the database (from a prior year or another committee)
 */

session_start();
if (!isset($_SESSION['user']))
{
    header("Location: index.php");
    die();
}
?>

<?php

include '../dbinfo.php';

$duesid = test_input($_POST["duesid"]);
$amount = test_input($_POST["amount"]);

if($_SESSION['viewTreasurer'] >= 1) {

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "UPDATE Dues SET Amount = '$amount'
            WHERE duesid = '$duesid'";

        $conn->exec($sql);

    } catch(PDOException $e) {
        error_log($e);
    }
}

$conn = null;

?>
