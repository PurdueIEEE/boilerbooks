<?php
	include '../dbinfo.php';
	//header('Location: /request/submitted.php '); 


	/*** Add purchase request to database ***/
	// At some point consider accepting all info using JSON formating 
	$email = $items = "";
	$email = test_input($_GET["email"]); //change back to POST
	

	
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// anyone with approval status in a committee for any amount can view the entire committee
	$sql = "SELECT U.username AS usrn FROM Users U WHERE email = '$email'";


	foreach ($conn->query($sql) as $row) {
		$items .= $row['usrn'] . ', ';

	}
	$items = rtrim($items,', ');
}
	catch(PDOException $e)
	{
		$returnStat = "Error";
	}

	$conn = null;
	echo '<br>The users are:<br>' . $items;






?>
