<?php
/*
 * This pages handles a committee chair adding someone new.
 */

session_start();
if (!isset($_SESSION['user']))
{
    header("Location: index.php");
    die();
}
require_once('../../common-functions.php');
?>

<?php

if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {

    $INVALID_RESPONSE_CODE = 406;  // No idea if this is the proper one

    include '../../dbinfo.php';

    $full_name = test_input($_POST["name"]);
    $email = test_input($_POST["email"]);
    $id = $_POST["id"];
    $committee = test_input($_POST["committee"]);

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT email FROM Dues WHERE LOWER(email) = LOWER('$email')";
        if($conn->query($sql)->rowCount() >= 1) {
            http_response_code($INVALID_RESPONSE_CODE);
            echo "A user with the email $email already exists in the current year ($g_current_fiscal_year).";
            exit();
        }

        $id_hash = hash("sha512", $id);

        $sql = "INSERT INTO Dues (Name,Email,id_hash,Committee,Fiscal_Year)
            VALUES ('$full_name', '$email', '$id_hash', '$committee', '$g_current_fiscal_year');
            ";

        $conn->exec($sql);

    } catch(PDOException $e) {
        error_log($e);
    }

    http_response_code(200);
} else {
    http_response_code(403);  // Forbidden
}
$conn = null;

?>
