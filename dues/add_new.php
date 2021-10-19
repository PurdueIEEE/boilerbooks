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
?>

<?php

include '../dbinfo.php';

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
        exit();
        // Should return some kinda of failure message ("new" person added who's email is already there)
    }

    $id_hash = hash("sha512", $id);

    $sql = "INSERT INTO Dues (Name,Email,id_hash,Committee,Year)
        VALUES ('$full_name', '$email', '$id_hash', '$committee', '$current_fiscal_year');
        ";

    $conn->exec($sql);

} catch(PDOException $e) {
}

$conn = null;

?>
