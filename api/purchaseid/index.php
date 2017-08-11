<?php
	/* This API provides info on a purchase for display. It also formats an ifram of the receipt
	/* Consider adding additional security to prevent certain people from seeing all receipts */

	include '../verify.php';

	$decode = 0;

	$usr = $_SESSION['user'];

	$purchaseid = test_input($_GET["purchaseid"]);

	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$sql = "SELECT DATE_FORMAT(p.purchasedate,'%m/%d/%Y') as date, p.modifydate as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
		p.cost, p.comments, p.fundsource, p.fiscalyear
		, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
		, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
		 FROM Purchases p 
		 WHERE p.purchaseID = $purchaseid";
		//$stmt->execute();


		foreach ($conn->query($sql) as $row) {
			$date = $row['date'];
			$mdate = $row['mdate'];
			$receipt = $row['receipt'];
			$item = $row['item'];
			$purchasereason = $row['purchasereason'];
			$vendor = $row['vendor'];
			$purchasedby = $row['purchasedby'];
			$approvedby = $row['approvedby'];
			$category = $row['category'];
			$status = $row['status'];
			$cost = $row['cost'];
			$comments = $row['comments'];
			$fundsource = $row['fundsource'];
			$fiscalyear = $row['fiscalyear'];
			$committee = $row['committee'];
		}

		$resultArray = array("date" => $date, "mdate" => $mdate, "receipt" => $receipt, "item" => $item, "purchasereason" => $purchasereason, "vendor" => $vendor, "purchasedby" => $purchasedby, "approvedby" => $approvedby, "category" => $category, "status" => $status, "cost" => $cost, "comments" => $comments, "fundsource" => $fundsource, "fiscalyear" => $fiscalyear, "committee" => $committee);
		$resultArray = json_encode($resultArray);
		echo $resultArray;
		$decoded = json_decode($resultArray);

		if ($decode == 1) {
			echo "<br><br>";
		    foreach($decoded as $key => $val)
		    {
		        //echo $row;
		        echo $key . ': ' . $val;
		        echo '<br>';
		    }
		}
		


	}
	catch(PDOException $e)
		{
		echo $sql . "<br>" . $e->getMessage();
		}

	$conn = null;

	// Prepare receipt iframe
	/*if ($_SESSION['receipt'] != '') {
		$pdfreceipt = "https://" . $_SERVER[HTTP_HOST] . $_SESSION['receipt'];
		$_SESSION['iframestuff'] = '<div class="row">
		<div class="col-sm-4"></div>
		<div class="col-sm-6">
			<iframe src= ' . $pdfreceipt . ' width="500" height="700">
				<a href=' . $pdfreceipt . '>Download receipt</a>
			</iframe>
		</div>
		<div class="col-sm-2"></div>
	</div>';

	}
	else {
		$_SESSION['iframestuff'] = '';
	}*/





	$headerStuff = "Location: /purchase.php?purchaseid=" . $purchaseid;
	//header($headerStuff); 
	


?>


