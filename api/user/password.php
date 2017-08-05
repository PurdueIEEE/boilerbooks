<?php
	include '../../dbinfo.php';


	$email = $items = "";
	$email = test_input($_POST["email"]);
	$usrn = test_input($_POST["usrn"]);
	//echo $email . '<br>';
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		// anyone with approval status in a committee for any amount can view the entire committee
		$sql = "SELECT U.username AS usrn FROM Users U WHERE email = '$email' AND U.username = '$usrn'";

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
		//echo '<br>The users are:<br>' . $items . '<br>';


	if ($items != '') {
		/*** Send email ***/
		 $to = $email;
		 $subject = "Boiler Books Password Reset";

		 $user = $_SESSION['user'];
		 $message = "<p>Hello! A password reset was requested for " . $usrn . ". Unfortunately this feature has not yet been implemented. Please forward this email to rakoskr6@gmail.com for further assistance in obtaining access to your Boiler Books account.";

		 $header = "From:ieeeboilerbooks@gmail.com \r\n";
		 $header .= "MIME-Version: 1.0\r\n";
		 $header .= "Content-type: text/html\r\n";

			 $retval = mail ($to,$subject,$message,$header);

			 if( $retval == true ) {
			 	//echo "Message sent successfully...";
			 }else {
			 	//echo "Message could not be sent...";
			 }
			 $header = 'Location: /user/forgotpassword.php?found=1&email=' . $email . '&usrn=' . $usrn;
		header($header); 
	}
	else {
		$header = 'Location: /user/forgotpassword.php?found=0&email=' . $email . '&usrn=' . $usrn;
		header($header); 
	}


?>
