<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include '../../menu.php';
?>

<?php

	include '../../dbinfo.php';
	$usr = $_SESSION['user'];

	$purchaseid = test_input($_GET["purchaseid"]);
	$_SESSION['purchaseid'] = $purchaseid;
	echo "For purchaseid " . $purchaseid .  ":<br><br>";

	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$sql = "SELECT DATE_FORMAT(p.purchasedate,'%m/%d/%Y') as date, p.modifydate as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
		p.cost, p.comments
		, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
		, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
		 FROM Purchases p WHERE p.purchaseID = $purchaseid";
		//$stmt->execute();


		foreach ($conn->query($sql) as $row) {
			$_SESSION['date'] = $row['date'];
			$_SESSION['mdate'] = $row['mdate'];
			$_SESSION['receipt'] = $row['receipt'];
			$_SESSION['item'] = $row['item'];
			$_SESSION['purchasereason'] = $row['purchasereason'];
			$_SESSION['vendor'] = $row['vendor'];
			$_SESSION['purchaseby'] = $row['purchasedby'];
			$_SESSION['approvedby'] = $row['approvedby'];
			$_SESSION['category'] = $row['category'];
			$_SESSION['status'] = $row['status'];
			$_SESSION['cost'] = $row['cost'];
			$_SESSION['comments'] = $row['comments'];
		}

	}
	catch(PDOException $e)
		{
		echo $sql . "<br>" . $e->getMessage();
		}

	$conn = null;

	// Prepare receipt iframe
	if ($_SESSION['receipt'] != '') {
		$pdfreceipt = "https://money.pieee.org" . $_SESSION['receipt'];
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
	}





	$headerStuff = "Location: /purchase.php?purchaseid=" . $purchaseid;
	header($headerStuff); 
?>


