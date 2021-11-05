<?php

include "../dbinfo.php";

function check_view_permission($purchaseID) {
    if($_SESSION["viewTreasurer"] > 0) {
        return true;  // A treasurer or president can view any purchase.
    }

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT purchaseID, username, committee
            FROM Purchases
            WHERE purchaseID = $purchaseID";

        $purchaser = $committee = '';
        foreach ($conn->query($sql) as $row) {
            $purchaser = $row['receipt'];
            $committee = $row['committee'];
        }
        if($purchaser === '') {
            return false;  // The purchase does not exist.
        }

        $usr = $_SESSION['usr'];
        if($purchaser === $usr) {
            return true;  // The user bought this purchase.
        }

        $sql = "SELECT username, committee
            FROM approval
            WHERE committee = '$committee' AND username = '$usr'";
        foreach($conn->query($sql) as $row) {
            return true;  // The user have approval powers in the committee of the purchase.
        }

        return false;  // The user is not allowed to view the purchase.
    } catch (PDOException $e) {
        error_log($e);
        return false;
    }
}

?>
