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

$INVALID_RESPONSE_CODE = 406;  // No idea if this is the proper one

if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {

    include '../dbinfo.php';

    $email = test_input($_POST["email"]);
    $committee = test_input($_POST["committee"]);

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // TODO: limit adding people to only one's own committee

        $currentYearEntryIndex = -1;
        $committee_prior = "";

        $sql = "SELECT * FROM Dues WHERE LOWER(email) = LOWER('$email')";
        $connQuery = $conn->query($sql);
        if($connQuery->rowCount() >= 1) {
            foreach ($connQuery as $row) {
                $id_hash = $row['id_hash'];
                $full_name = $row['Name'];

                if($current_fiscal_year === $row['Fiscal_Year']) {
                    $currentYearEntryIndex = $row['duesid'];
                    $committee_prior = $row['Committee'];
                }
            }
        } else {
            http_response_code($INVALID_RESPONSE_CODE);
            echo "ID was not populated and no ID for ($email) was found on file";
            exit();
            // error message for someone new not populating their ID
        }

        if($currentYearEntryIndex !== -1) {
            $committee_list = explode(',', $committee_prior);
            foreach(explode(',', $committee) as $committee_name_new) {
                if(!in_array($committee_name_new, $committee_list, true)) {
                    $committee_list[] = $committee_name_new;
                }
            }
            $committee = implode(',', $committee_list);

            $sql = "UPDATE Dues SET Committee = '$committee'
                WHERE duesid = '$currentYearEntryIndex'
                ";
        } else {
            $sql = "INSERT INTO Dues (Name,Email,id_hash,Committee,Fiscal_Year)
                VALUES ('$full_name', '$email', '$id_hash', '$committee', '$current_fiscal_year');
                ";
        }

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
