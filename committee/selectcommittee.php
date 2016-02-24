<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include '../menu.php';

?>

<?php
include '../dbinfo.php';
$items = '';
$items2 = '';
$usr = $_SESSION['user'];
$committee = test_input($_POST["committee"]);

if ($committee == '') {
	$committee = test_input($_GET["committee"]);
}


try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// anyone with approval status in a committee for any amount can view the entire committee
	$sql = "SELECT DATE_FORMAT(p.purchasedate,'%m/%d/%Y') as date, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
	p.cost, p.comments
	, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
	, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
	 FROM Purchases p
			INNER JOIN approval a ON a.committee = p.committee
			WHERE p.committee = '$committee'
			AND a.username = '$usr'
			ORDER BY p.purchasedate";
	//$stmt->execute();


	foreach ($conn->query($sql) as $row) {
		$items.= '<tr> <td>';
		$items .= $row['date'];
		$items .= '</td> <td><a href=';
		$items .= $row['receipt'];
		$items .= '>';
		$items .= $row['item'];
		$items .= '</a></td> <td>';
		$items .= $row['purchasereason'];
		$items .= '</td> <td>';
		$items .= $row['vendor'];
		$items .= '</td> <td>';
		$items .= $row['purchasedby'];
		$items .= '</td> <td>';
		$items .= $row['approvedby'];
		$items .= '</td> <td>';
		$items .= $row['category'];
		$items .= '</td> <td>';
		$items .= $row['status'];
		$items .= '</td> <td>$';
		$items .= $row['cost'];
		$items .= '</td> <td>';
		$items .= $row['comments'];


		$items .= '</td></tr>';


	}
	$_SESSION['commiteepurchases'] = $items;
	$_SESSION['committee'] = $committee;
		//echo $items;


	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;



// income
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// anyone with approval status in a committee for any amount can view the entire committee
	$sql = "SELECT *, DATE_FORMAT(updated,'%m/%d/%Y') as date
	 FROM Income I
			INNER JOIN approval a ON a.committee = I.committee
			WHERE I.committee = '$committee'
			AND a.username = '$usr'
			ORDER BY I.updated";
	//$stmt->execute();


	foreach ($conn->query($sql) as $row) {
		$items2.= '<tr> <td>';
		$items2 .= $row['date'];
		$items2 .= '</td> <td>';
		$items2 .= $row['source'];
		$items2 .= '</td> <td>';
		$items2 .= $row['type'];
		$items2 .= '</td> <td>';
		$items2 .= $row['amount'];
		$items2 .= '</td> <td>';
		$items2 .= $row['item'];
		$items2 .= '</td> <td>';
		$items2 .= $row['status'];
		$items2 .= '</td> <td>';
		$items2 .= $row['comments'];


		$items2 .= '</td></tr>';


	}
	$_SESSION['commiteeincome'] = $items2;

	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;





header("Location: index.php");

?>
