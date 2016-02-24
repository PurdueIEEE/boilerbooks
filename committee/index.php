<?php
	$title = 'Boiler Books';
	$committeeactive = "active";
	include '../menu.php';
?>



<div class="container">
    <select id="committee" name="committee" class="form-control" onchange="selectcommittee()">
      <option value="">Select Committee</option>
	  <option value="General IEEE">General IEEE</option>
	  <option value="Aerial Robotics">Aerial Robotics</option>
      <option value="Computer Society">Computer Society</option>
      <option value="EMBS">EMBS</option>
      <option value="Learning">Learning</option>
      <option value="Racing">Racing</option>
      <option value="ROV">ROV</option>
      <option value="Rocket">Rocket</option>
    </select>
 
<div>





<div class="container">
	<h3 class="text-center">
	<?php echo $_SESSION['committee'];?> Expenses</h3>
	<table id="expensestable" class="display">
		<thead>
			<tr>
				<th>Purchase Date</th>
				<th>Item</th>
				<th>Reason</th>
				<th>Vendor</th>
				<th>Purchased By</th>
				<th>Reviewed By</th>
				<th>Category</th>
				<th>Status</th>
				<th>Amount</th>
				<th>Comments</th>
			</tr>
		</thead>
		<tbody>
			<?php echo $_SESSION['commiteepurchases'] ?>
		</tbody>
	</table>
	<script>
	$(document).ready(function() {
	    $('#expensestable').DataTable( {
	        createdRow: function ( row ) {
	            $('td', row).attr('tabindex', 0);
	        }
	    } );
	} );
	</script>
</div>

<br> <br> <br>

<div class="container">
	<h3 class="text-center"><?php echo $_SESSION['committee'] ?> Income</h3>
	<table id="incometable" class="display">
		<thead>
			<tr>
				<th>Date</th>
				<th>Source</th>
				<th>Type</th>
				<th>Amount</th>
				<th>Item (if donated)</th>
				<th>Status</th>
				<th>Comments</th>
			</tr>
		</thead>
		<tbody>
			<?php echo $_SESSION['commiteeincome'] ?>
		</tbody>
	</table>
	<script>
	$(document).ready(function() {
	    $('#incometable').DataTable( {
	        createdRow: function ( row ) {
	            $('td', row).attr('tabindex', 0);
	        }
	    } );
	} );
	</script>
</div>

<script>
	function selectcommittee() {
		var com = document.getElementById('committee').value;
		var title = "selectcommittee.php?committee=";
		var full = title.concat(com);
		window.location = full;
	}
</script>

<?php
	include '../smallfooter.php';
?>
