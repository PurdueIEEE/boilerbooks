<?php
	include '../menu.php';
?>

<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";
$items = '';
$usr = $_SESSION['user'];


try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT DATE(p.purchasedate) as date, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
	p.cost, p.comments, p.username purchasedby
	, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
	FROM Purchases p
			WHERE p.username = '$usr'
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
		$items .= $row['committee'];
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
		//echo $items;


	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;
?>






<?php
	include '../smallfooter.php';
?>
