<?php
/*** This api inserts information into the database that is needed for transferring money
 * between committees, which requires both a purchase from the transferred committee and
 * income recorded on the receiving committee. ***/

    session_start();
    if (!isset($_SESSION['user']))
    {
        header("Location: ../index.php");
        die();
    }
    header('Location: /donation/ ');
?>

<?php
    include '../../dbinfo.php';
    $returnStat = "200";

    /*** Add purchase request to database ***/
    // At some point consider accepting all info using JSON formatting
    $committee_from = $committee_to = $amount = $item = $comments = "";
    $committee_from = test_input($_POST["committee-from"]);
    $committee_to = test_input($_POST["committee-to"]);
    if($committee_to == $committee_from) {
        exit();
    }
    $amount = test_input($_POST["amount"]);
    $item = "Transfer from $committee_from to $committee_to.";
    $comments = test_input($_POST["comments"]);
    $reason = "Transfer";
    $vendor = "Internal";
    $usr = $_SESSION['user']; // eventually make this a passed parameter (maybe)

    try {
        $amount = test_input(str_replace('$', '', $amount));
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "INSERT INTO Purchases (username,item,purchasereason,vendor,committee,cost,status,comments)
            VALUES ('$usr', '$item', '$reason', '$vendor', '$committee_from', '$amount', 'Requested', '$comments');
            ";

        // use exec() because no results are returned
        $conn->exec($sql);
        $sql = "SELECT @@IDENTITY AS PID;";
        foreach ($conn->query($sql) as $row) {
            $currentitemid = $row['PID'];
        }
    } catch(PDOException $e) {
        error_log($e->getMessage());
        $returnStat = "Failed to add request to database";
    }

    $conn = null;


    // Submit the transfer to the income table
    $item .= " Purchase Number $currentitemid.";
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "INSERT INTO Income (updated, committee, source, amount, item, type, status, comments, addedby)
                VALUES (NOW(), '$committee_to', '$committee_from', '$amount', '$item', 'BOSO', 'Expected', '$comments', '$usr')";

        //$sql = "INSERT INTO Purchases (item)
        //VALUES ('$item')";

        // use exec() because no results are returned
        $conn->exec($sql);
        echo "Inserted";
    } catch(PDOException $e) {
        error_log($e->getMessage());
        echo $sql . "<br>" . $e->getMessage();
    }

    // Clear unused variables
    $item = $reason = $vendor = $committee = $cost = $comments = $category = "";

    // eventually consider the API to pass back info using JSON
    //$jsonArray = compact("item", "names","returnStat");
    //echo json_encode($jsonArray);
?>
