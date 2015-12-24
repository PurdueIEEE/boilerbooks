<?php 
	session_start();
	if (!isset($_SESSION['user']))
	{
		header("Location: ../index.php");
		die();
	}
?>

<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";

// define variables and set to empty values
$item = $reason = $vendor = $committee = $cost = $comments = $category = "";

$item = test_input($_POST["item"]);
$reason = test_input($_POST["reason"]);
$vendor = test_input($_POST["vendor"]);
$committee = test_input($_POST["committee"]);
$cost = test_input($_POST["cost"]);
$comments = test_input($_POST["comments"]);
$category = test_input($_POST["category"]);
$stat = test_input($_POST["status"]);
$fundsource = test_input($_POST["fundsource"]);
$usr = $_SESSION['user'];
$purchaseid = $_SESSION['currentitem'];

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
 

try {
	$cost = test_input(str_replace('$','',$cost));
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "UPDATE Purchases SET username='$usr', item='$item', purchasereason='$reason', vendor='$vendor',
	committee='$committee', category='$category', cost='$cost', status='$stat', fundsource='$fundsource',
	comments='$comments' WHERE Purchases.purchaseID = '$purchaseid'";
	
    //$sql = "INSERT INTO Purchases (item) 
	//VALUES ('$item')";
	
	// use exec() because no results are returned
    $conn->exec($sql);
    echo "New record created successfully";
    }
catch(PDOException $e)
    {
    echo $sql . "<br>" . $e->getMessage();
    }

$conn = null; 

?>

<?php header('Location: index.php'); ?>