<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include '../menu.php';
	
?>

<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";
$items = '';
$usr = $_SESSION['user'];
$committee = test_input($_POST["committee"]);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT DATE(p.purchasedate) as date, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status, 
	p.cost, p.comments FROM Purchases p
			WHERE p.committee = '$committee'
			ORDER BY p.purchasedate";
	//$stmt->execute();
	
	
	foreach ($conn->query($sql) as $row) {
		$items.= '<tr> <td>';
		$items .= $row['date'];
		$items .= '</td> <td>';
		$items .= $row['item'];
		$items .= '</td> <td>';
		$items .= $row['purchasereason'];
		$items .= '</td> <td>';
		$items .= $row['vendor'];
		$items .= '</td> <td>';
		$items .= $row['committee'];
		$items .= '</td> <td>';
		$items .= $row['category'];
		$items .= '</td> <td>';
		$items .= $row['receipt'];
		$items .= '</td> <td>';
		$items .= $row['status'];
		$items .= '</td> <td>';
		$items .= $row['amount'];
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


header("Location: index.php");

?>