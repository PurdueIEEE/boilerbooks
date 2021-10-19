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

$email = test_input($_POST["email"]);
$amount = test_input($_POST["amount"]);

if($_SESSION['viewTreasurer'] >= 1) {

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // TODO: limit adding people to only one's own committee

        $currentYearEntryIndex = -1;

        $sql = "SELECT * FROM Dues WHERE LOWER(email) = LOWER('$email') AND Year = $current_fiscal_year";
        $connQuery = $conn->query($sql);
        if($connQuery->rowCount() >= 1) {
            foreach ($connQuery as $row) {
                $currentYearEntryIndex = $row['index'];
                break;
            }

            $sql = "UPDATE Dues SET Amount = $amount
                WHERE index = $currentYearEntryIndex
                ";

            $conn->exec($sql);
        } else {
            exit();
            // error message for someone new not populating their ID
        }

    } catch(PDOException $e) {
    }
}

$conn = null;

?>
