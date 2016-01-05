<?php 
	session_start();
	if (!isset($_SESSION['user']))
	{
		header("Location: ../index.php");
		die();
	}
?>
<?php header('Location: /request/newpurchasesubmitted.php '); ?>
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
$usr = $_SESSION['user'];

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
    $sql = "INSERT INTO Purchases (username,item,purchasereason,vendor,committee,category,cost,status,fundsource,comments)
    VALUES ('$usr', '$item', '$reason', '$vendor', '$committee', '$category', '$cost', 'Requested', 'BOSO', '$comments')";
	
	// use exec() because no results are returned
    $conn->exec($sql);
    echo "New record created successfully";
    }
catch(PDOException $e)
    {
    echo $sql . "<br>" . $e->getMessage();
    }

$conn = null; 


$_SESSION['item'] = $item;
?>
