<?php

/*
    For some BRAIN DAMAGED reason, PHP will search on the include path and cwd
    of whatever included this file, not from purchase/check_permission.php.
    So we will first attempt to include as if we're in the root directory (for the repo),
    then include as it we're in a subfolder. Including a parent directory from
    the repo root may locate the dbinfo.php file in either money/ or dev-money/.
*/
if(file_exists("./dbinfo.php")) {
    require_once("./dbinfo.php");
} else {
    require_once("../dbinfo.php");
}

function check_view_permission($purchaseID) {
    global $servername, $dbname, $username, $password;

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
            $purchaser = $row['username'];
            $committee = $row['committee'];
        }
        if($purchaser === '') {
            return false;  // The purchase does not exist.
        }

        $usr = $_SESSION['user'];
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
