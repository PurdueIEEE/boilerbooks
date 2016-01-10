<?php
	$title = 'Boiler Books';
	$treasuereactive = "active";
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
	$sql = "SELECT DATE(p.purchasedate) as date
, p.item
, p.purchaseID
, p.purchasereason
, p.vendor
, p.committee
, p.category
, p.receipt
, p.status
, p.cost
, p.comments
,(SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
,(SELECT CONCAT(U2.first, ' ', U2.last) FROM Users U2 WHERE U2.username = p.approvedby) approvedby
FROM Purchases p
WHERE p.status in ('Purchased','Processing Reimbursement', 'Reimbursed')
AND '$usr' = (
    SELECT U3.username FROM Users U3
    INNER JOIN approval A ON U3.username = A.username
    WHERE A.role = 'treasurer')

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
		$items .= $row['purchasedby'];
		$items .= '</td> <td>';
		$items .= $row['approvedby'];
		$items .= '</td> <td>';
		$items .= $row['status'];
		$items .= '</td> <td>';
		$items .= $row['cost'];
		$items .= '</td> <td>';
		$items .= $row['comments'];
		$items .= '</td> <td>';

		$items .= "<form class='form' action='update.php' method='post'>
		<fieldset>";
	  $items .= "<label><input type='radio' name='processing' id='processing' value='";
		$items .= $row['purchaseID'];
		$items .= "'></label>";
		$items .= '</td> <td>';




		$items .= "<label><input type='radio' name='reimbursed' id='reimbursed' value='";
		$items .= $row['purchaseID'];
		$items .= "'></label>";



		$items .= '</td> <td>';
		$items .= "<div class='form-group'>
		  <label class='col-md-4 control-label' for='submit'></label>
		  <div class='col-md-4'>
		    <button id='submit' name='submit' class='btn btn-primary'>Update</button>
		  </div>
		</div>";

		$items .= "</fieldset>
		</form>";
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
				<th>Purchased By</th>
				<th>Reviewed By</th>
				<th>Status</th>
				<th>Amount</th>
				<th>Comments</th>
				<th>Processing</th>
				<th>Reimbursed</th>
				<th>Update</th>
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
