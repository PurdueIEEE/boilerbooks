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
 

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT DATE(p.purchasedate) as date, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status, 
	p.cost, p.comments FROM Purchases p
			WHERE p.username = '$usr'
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
		//echo $items;
		
	
	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null; 
?>

<div class="container">          
	<table class="table">
		<thead>
			<tr>
				<th>Purchase Date</th>
				<th>Item</th>
				<th>Reason</th>
				<th>Vendor</th>
				<th>Committee</th>
				<th>Category</th>
				<th>Receipt</th>
				<th>Status</th>
				<th>Amount</th>
				<th>Comments</th>
			</tr>
		</thead>
		<tbody>
			<?php echo $items ?>
		</tbody>
	</table>
</div>



		
<?php 
	include '../smallfooter.php';
?>