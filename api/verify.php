<?php
	/* This file is included before beginning other API calls in order to ensure the user is properly logged in. Future functionality will add specific permission checking as well (hopefully)  */
	

	include '../../dbinfo.php';
	
	// define variables and set to empty values
	$apikey = $user = "";

	$apikey = test_input($_GET["apikey"]); 
	$user = test_input($_GET["user"]); 

	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = "SELECT apikey, apikeygentime FROM Users WHERE Users.username = '$user'";
		$stmt = $conn->prepare($sql);
		$stmt->execute();

		$results = $stmt->fetchAll();
		foreach ($results as $pswd) {
			$dbpsw = $pswd['apikey'];
			$dbtime = $pswd['apikeygentime'];
		}
		$now = date('Y-m-d H:i:s');

		$datetime1 = new DateTime($dbtime);
		$datetime2 = new DateTime($now);
		$interval = $datetime1->diff($datetime2);
		//echo $interval->format('%i minutes');
		$timediff = $interval->format('%i');

		if (!(password_verify($apikey,$dbpsw) && ($timediff<=120)))
		{

			$headerinfo = "Location: /index.php?returnto=" . $_SERVER['REQUEST_URI'];
			header($headerinfo);
			die();
		}
		

		}
	catch(PDOException $e)
		{
			echo $sql . "<br>" . $e->getMessage();
			$headerinfo = "Location: /index.php?returnto=" . $_SERVER['REQUEST_URI'];
			header($headerinfo);
			die();
		}

	$conn = null;

?>


