<?php
	$title = 'Boiler Books';
	$treasuereactive = "active";
	include '../menu.php';

?>

<?php
include '../dbinfo.php';

$items = '';
$usr = $_SESSION['user'];


try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT DATE_FORMAT(p.purchasedate,'%m/%d/%Y') as date
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
, p.username
,(SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
,(SELECT CONCAT(U2.first, ' ', U2.last) FROM Users U2 WHERE U2.username = p.approvedby) approvedby
FROM Purchases p
WHERE p.status in ('Purchased','Processing Reimbursement', 'Reimbursed')
AND '$usr' in (
    SELECT U3.username FROM Users U3
    INNER JOIN approval A ON U3.username = A.username
    WHERE (A.role = 'treasurer' OR A.role = 'president'))

ORDER BY p.purchasedate DESC";
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
		$items .= "</td> <td><a href='user.php?usrlookup=";
		$items .= $row['username'];
		$items .= "'>";
		$items .= $row['purchasedby'];
		$items .= '</a></td> <td>';
		$items .= $row['approvedby'];
		$items .= '</td> <td>';
		$items .= $row['status'];
		$items .= '</td> <td>';
		$items .= $row['cost'];
		$items .= '</td> <td>';
		$items .= $row['comments'];


		$items .= "</td> <td><a href='update.php?reimbursed=-1&processing=";
		$items .= $row['purchaseID'];
		$items .= "'>Mark Processing";
		$items .= '</a></td> <td>';

		$items .= "<a href='update.php?processing=-1&reimbursed=";
		$items .= $row['purchaseID'];
		$items .= "'>Mark Reimbursed";
		$items .= '</a></td>';





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
	<table id="treasurertable" class="display">
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
			</tr>
		</thead>
		<tbody>
			<?php echo $items ?>
		</tbody>
	</table>
	<script>
	$(document).ready(function() {
	    $('#treasurertable').DataTable( {

	        createdRow: function ( row ) {
	            $('td', row).attr('tabindex', 0);
							stateSave: true
	        }

	    } );
	} );
	</script>
</div>




<?php
	include '../smallfooter.php';
?>
