<?php
	// Performs the user login and verification

	session_start();
	include 'dbinfo.php';

	// define variables and set to empty values
	$psw = $usr = "";

	$psw = ($_POST["psw"]);
	$usr = test_input($_POST["usr"]);

	// run query to get hashed password for selected user
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("SELECT password FROM Users WHERE Users.username = '$usr'");
		$stmt->execute();

		$results = $stmt->fetchAll();
		foreach ($results as $pswd) {
			$dbpsw = $pswd['password'];
		}


		// Verifies password
		if (password_verify($psw,$dbpsw))
		{
			$_SESSION['user'] = $usr;

			/***** Figures out what options to display to user ******/

			try {
				$conn2 = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql2 = "SELECT MAX(A.amount) AS maxAmount, MAX(privilege_level) AS maxPriviledge, A.approvalID
                    FROM approval A
                    WHERE A.username = '$usr' AND A.privilege_level > " . AccessLevel::MEMBER;

                $conn2Query = $conn2->query($sql2);
                if($conn2Query->rowCount() >= 1) {
                    $_SESSION['viewCommitteeExpenses'] = 1;
                    $_SESSION['viewReceiveDonation'] = 1;
                    foreach($conn2Query as $row2) {
                        $_SESSION['viewApprovePurchase'] = $row2['maxAmount'] > 0;
                        $_SESSION['viewCommitteeDues'] = $row2['maxPriviledge'] >= AccessLevel::OFFICER;
                        $_SESSION['viewTreasurer'] = $row2['maxPriviledge'] >= AccessLevel::TREASURER;
				        $_SESSION['viewIncome'] = $row2['maxPriviledge'] >= AccessLevel::TREASURER;
                    }
                } else {
                    $_SESSION['viewCommitteeExpenses'] = 0;
                    $_SESSION['viewReceiveDonation'] = 0;
                    $_SESSION['viewApprovePurchase'] = 0;
                    $_SESSION['viewCommitteeDues'] = 0;
                    $_SESSION['viewTreasurer'] = 0;
                    $_SESSION['viewIncome'] = 0;
                }
			}
			catch(PDOException $e)
			{
				echo $sql2 . "<br>" . $e->getMessage();
			}



			$randNum = base64_encode(random_bytes(64));

			// string replace because I'm sturgling with URL encoding
	  		$randNum = str_replace('+','_',$randNum);
	  		$randNum = str_replace('/','-',$randNum);
	  		$randNum = str_replace('=','-',$randNum);

			$randNumEn = password_hash($randNum,PASSWORD_DEFAULT);

			try {
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				// set the PDO error mode to exception
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$sql = "UPDATE Users SET apikeygentime = NOW(), apikey='$randNumEn', modifydate=NOW() WHERE username = '$usr'";
				$conn->exec($sql);
				$_SESSION['apikey'] = $randNum;
			}
            catch(PDOException $e)
            {
                echo $sql . "<br>" . $e->getMessage();
            }

		$conn = null;




        $_SESSION['fiscalyear'] = $g_current_fiscal_year; // initialize for viewing committee expenses

		$returnto = test_input2($_GET['returnto']);

		if ($returnto != '') {
			$headerinfo = "Location: " . $returnto;
        } else {
			$headerinfo = "Location: loggedin.php";
		}
		header($headerinfo);
	}
	else
	{
		header("Location: index.php?fail=Incorrect Username or Password");
	}

	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}

	$conn = null;

?>
