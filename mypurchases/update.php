<?php
	session_start();
	if (!isset($_SESSION['user'])) {
		header("Location: ../index.php");
		die();
	}
?>
<?php //header('Location: /request/newpurchasesubmitted.php '); ?>
<?php
include '../dbinfo.php';



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

} catch(PDOException $e) {
	echo $sql . "<br>" . $e->getMessage();
}

$conn = null;



echo "Valid User: ".$validuser."<br>";
if ($validuser >= 1) {
	// define variables and set to empty values
	$item = $reason = $vendor = $committee = $cost = $comments = $category = "";

	$purchaseid = test_input($_GET["purchaseid"]);
	$status = test_input($_GET["status"]);

	$usr = $_SESSION['user'];
	echo $processing;
	echo "<br>";


	echo $stat;

	try {
		$cost = test_input(str_replace('$', '', $cost));
	    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	    // set the PDO error mode to exception
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $sql = "UPDATE Purchases SET status='$status' WHERE Purchases.purchaseid = '$purchaseid'";

		// use exec() because no results are returned
	    $conn->exec($sql);
	    echo "Updated";
    } catch(PDOException $e) {
	    echo $sql . "<br>" . $e->getMessage();
    }

	$conn = null;

}


header('Location: /mypurchases/index.php');

?>
