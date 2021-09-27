<?php
session_start();
if (!isset($_SESSION['user']))
{
	header("Location: ../index.php");
	die();
}
?>
<?php //header('Location: /request/newpurchasesubmitted.php '); ?>
<?php
include '../dbinfo.php';
include '../helper/email.php';

$validuser = '';
$usr = $_SESSION['user'];

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT COUNT(U3.username) AS validuser FROM Users U3
	INNER JOIN approval A ON U3.username = A.username
	WHERE (A.role = 'treasurer' OR A.role = 'president')
	AND U3.username = '$usr'";
	//$stmt->execute();

	foreach ($conn->query($sql) as $row) {
		$validuser .= $row['validuser'];
	}
}
catch(PDOException $e)
{
	echo $sql . "<br>" . $e->getMessage();
}

$conn = null;



echo "Valid User: " . $validuser . "<br>";
if ($validuser >= 1) {
	// define variables and set to empty values
	$item = $reason = $vendor = $committee = $cost = $comments = $category = "";

	$newStatus = test_input($_POST["status"]);
	$rawIdsString = test_input($_POST["chosen"]);
	$idsStringQuoted = str_replace(',', "','", $rawIdsString);
	$usr = $_SESSION['user'];
	echo $processing;
	echo "<br>";
	echo $reimbursed;
	echo "<br>";


	try {
		$cost = test_input(str_replace('$','',$cost));
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	    // set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = "UPDATE Purchases SET modifydate = NOW(), status='$newStatus'
		WHERE Purchases.purchaseID IN ('$idsStringQuoted')";

		// use exec() because no results are returned
		$conn->exec($sql);
		echo "Updated";
	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}

	$conn = null;


    if ($sendemail == 1) {
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "SELECT U.email, item, committee, status FROM Purchases P
            INNER JOIN Users U ON U.username = P.username
            WHERE P.purchaseID IN ('$idsStringQuoted')";
            //$stmt->execute();

            error_log("hello");
            $itemsByEmail = array();
            $committeesByEmail = array();
            foreach ($conn->query($sql) as $row) {
                $email = $row['email'];
                if(!array_key_exists($email, $itemsByEmail)) {
                    $itemsByEmail[$email] = array();
                    $committeesByEmail[$email] = array();
                }
                $itemsByEmail[$email][] = $row['item'];
                $committee = $row['committee'];
                if(!in_array($committee, $committeesByEmail[$email], true)) {
                    $committeesByEmail[$email][] = $committee;
                }
                error_log($email);
            }

        }
        catch(PDOException $e)
        {
            echo $sql . "<br>" . $e->getMessage();
        }

        $conn = null;

        $subject = "Your purchased item is now $newStatus";

        foreach($itemsByEmail as $email_addr => $items) {
            $itemsFormatted = implode(", ", $items);
            $committeeFormatted = implode(", ", $committeesByEmail[$email]);
            $message = "<p>$itemsFormatted for $committeeFormatted is now $newStatus.</p>";
            if($newStatus === 'Reimbursed') {
                $message .= "<p>Please stop by EE 14 to pick up your check.</p>";
            } else {
                $message .= "<p>Check <a href='money.pieee.org'>money.pieee.org</a> or contact the treasurer.</p>";
            }

            send_email($email, $subject, $message);
        }
    }
}


header('Location: /treasurer/index.php');

?>
