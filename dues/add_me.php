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


    $id_hash = ($id === "") ? "" : hash("sha512", $id);

    // Find the member's existing ID hash (if present) and figure out if that have already
    //  been entered into the current year.
    $sql = "SELECT id_hash, Email, Year, index FROM Dues WHERE LOWER(email) = LOWER('$email')";
    $connQuery = $conn->query($sql);
    $currentYearEntryIndex = -1;  // Index of the entry for the current year of this member
    $invalid = false;
    if($connQuery->rowCount() >= 1) {
        foreach ($connQuery as $row) {
            if($id_hash !== $row['id_hash'] && $id_hash !== "") {
                exit(); // the given id doesn't match (despite the same email)
            }
            $id_hash = $row['id_hash'];
            if($current_fiscal_year === $row['Year']) {
                $currentYearEntryIndex = $row['index'];
            }
        }
    } else {
        if($id_hash === "") {
            exit();
            // error message for someone without an existing id hash not populating their ID
        }
    }

    if($currentYearEntryIndex !== -1) {
        $sql = "UPDATE Dues SET Committee = $committee
            WHERE index = $currentYearEntryIndex
            ";
    } else {
        $sql = "INSERT INTO Dues (Name,Email,id_hash,Committee,Year)
            VALUES ('$full_name', '$email', '$id_hash', '$committee', '$current_fiscal_year');
            ";
    }

    $conn->exec($sql);

} catch(PDOException $e) {
}

$conn = null;

?>
