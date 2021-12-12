<?php
/*
 * This pages handles someone adding themself.
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


    $id_hash = ($id === "") ? "" : hash("sha512", $id);

    // Find the member's existing ID hash (if present) and figure out if that have already
    //  been entered into the current year.
    $sql = "SELECT id_hash, Email, Fiscal_Year, duesid FROM Dues WHERE LOWER(email) = LOWER('$email')";
    $connQuery = $conn->query($sql);
    $currentYearEntryIndex = -1;  // Index of the entry for the current year of this member
    $invalid = false;
    if($connQuery->rowCount() >= 1) {
        foreach ($connQuery as $row) {
            if($id_hash !== $row['id_hash'] && $id_hash !== "") {
                http_response_code($INVALID_RESPONSE_CODE);
                echo "Mismatch between IDs in database and given ID (if any).";
                exit(); // the given id doesn't match (despite the same email)
            }
            $id_hash = $row['id_hash'];
            if($g_current_fiscal_year === $row['Fiscal_Year']) {
                $currentYearEntryIndex = $row['duesid'];
            }
        }
    } else {
        if($id_hash === "") {
            http_response_code($INVALID_RESPONSE_CODE);
            echo "No ID given and none found in the database.";
            exit();
            // error message for someone without an existing id hash not populating their ID
        }
    }

    if($currentYearEntryIndex !== -1) {
        $sql = "UPDATE Dues SET Committee = '$committee'
            WHERE duesid = '$currentYearEntryIndex'
            ";
    } else {
        $sql = "INSERT INTO Dues (Name,Email,id_hash,Committee,Fiscal_Year)
            VALUES ('$full_name', '$email', '$id_hash', '$committee', '$g_current_fiscal_year');
            ";
    }

    $conn->exec($sql);

} catch(PDOException $e) {
    error_log($e);
}

http_response_code(200);
$conn = null;

?>
