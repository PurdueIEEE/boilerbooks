<?php
	$title = 'Boiler Books';
	$treasuereactive = "active";
	include '../menu.php';
	include '../dbinfo.php';

	$committee = test_input($_GET["committee"]);
	if ($committee == '') {
		$committee = "%";
		$committeeDisplay = "all committees";
	}
	else {
		$committeeDisplay = $committee;
	}


	$fiscalyear = test_input($_GET["fiscalyear"]);
	if ($fiscalyear == '') {
		$fiscalyear = '2017-2018';
	}

	$items = '';
	$usr = $_SESSION['user'];

	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = "SELECT *
		FROM Income i
		ORDER BY i.updated DESC";


		foreach ($conn->query($sql) as $row) {
			$items .= '<tr> <td>';
			$items .= $row['source'];
			$items .= '</td> <td>';
			$items .= $row['type'];
			$items .= '</td> <td>';
			$items .= $row['amount'];
			$items .= '</td> <td>';
			$items .= $row['item'];
			$items .= '</td> <td>';
			$items .= $row['status'];
			$items .= '</td> <td>';
			$items .= "<a href='update.php?processing=-1&reimbursed=";
			$items .= $row['incomeid'];
			$items .= "'>";
			if(strcmp($row['status'],'Expected') == 0) {
				$items .= 'Mark Received';
			} else {
				$items .= 'Mark Expected';
			}
			$items .= '</a></td>';

			$items .= "</fieldset>
		</form>";
		$items .= '</td></tr>';

		}

	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}

	$conn = null;
?>


<div class="container">
	<div class="text-center">
		<h3>Income</h3>
	</div>
</div>


<br>

<br>

<div class="container">
	<table id="treasurertable" class="display">
		<thead>
			<tr>
				<th>Source</th>
				<th>Type</th>
				<th>Amount</th>
				<th>Item</th>
				<th>Status</th>
				<th>Change Status</th>
			</tr>
		</thead>
		<tbody>
			<?php echo $items ?>
		</tbody>
	</table>
	<script>
		$(document).ready(function() {
			$('#treasurertable').DataTable( {
				"order": [[ 1, "desc" ]]
			} );
			stateSave: true

		} );

		function selectcommitteeyear() {

			var com = document.getElementById('committee').value;
			if (com == '') {
				com = "<?php echo $committee ?>";
			}
			var title = "index.php?committee=";
			var partial  = title.concat(com);
			var com2 = document.getElementById('fiscalyear').value;

			if (com2 == '') {
				com2 = "<?php echo $fiscalyear ?>";
			}
			var fiscalyear = "&fiscalyear=";
			var tempFinal = fiscalyear.concat(com2);
			fullFinal = partial.concat(tempFinal);

			window.location = fullFinal;
		}

	</script>
</div>




<?php
	include '../smallfooter.php';
?>

