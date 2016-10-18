<?php
	$title = 'Boiler Books';
	$committeeactive = "active";
	include '../menu.php';
?>



<div class="container">
	<div class="row">
		<div class="col-sm-6">
		    <select id="committee" name="committee" class="form-control" onchange="selectcommittee()">
		      <?php include '../committees.php'; ?>
		    </select>
		</div>
		<div class="col-sm-6">
		    <select id="fiscalyear" name="fiscalyear" class="form-control" onchange="selectyear()">
		    	<option value="2016-2017">Select Year</option>
		    	<option value="2016-2017">2016 - 2017</option>
		    	<option value="2015-2016">2015 - 2016</option>
		    </select>
		</div>
	</div>
</div>

<div>

</div>

	<div class="container">
		<div class = "row">
			<div class="col-sm-3">
				<h4 class="text-left">Balance: $<?php echo number_format($_SESSION['left'],2);?></h4>
			</div>
			<div class="col-sm-3">
				<h4 class="text-center">Income: $<?php echo number_format($_SESSION['incometotal'],2);?></h4>
			</div>
			<div class="col-sm-3">
				<h4 class="text-center">Spent: $<?php echo number_format($_SESSION['spent'],2);?></h4>
			</div>
			<div class="col-sm-3">
				<h4 class="text-right">Budget: $<?php echo number_format($_SESSION['totalbudget'],2);?></h4>
			</div>
		</div>
	</div>

	<div class="container">
		<h3 class="text-center">
		<?php echo $_SESSION['fiscalyear'] . ' ' . $_SESSION['committee'];?> Expenses Summary</h3>
		<table id="expensestablesummary" class="display">
			<thead>
				<tr>
					<th>Category</th>
					<th>Spent</th>
					<th>Budget</th>
				</tr>
			</thead>
			<tbody>
				<?php echo $_SESSION['commiteepurchasessummary'] ?>
			</tbody>
		</table>
		<script>
		$(document).ready(function() {
		    $('#expensestablesummary').DataTable( {

		        createdRow: function ( row ) {
		            $('td', row).attr('tabindex', 0);
		        }

		    } );
		} );
		</script>
	</div>

	<br> <br> <br>





<div class="container">
	<h3 class="text-center">
	<?php echo $_SESSION['fiscalyear'] . ' ' . $_SESSION['committee'];?> Expenses</h3>
	<table id="expensestable" class="display">
		<thead>
			<tr>
				<th>Purchase Date</th>
				<th>Purchase Number</th>
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
	<h3 class="text-center"><?php echo $_SESSION['fiscalyear'] . ' ' . $_SESSION['committee'] ?> Income</h3>
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

<script>
	function selectyear() {
		var com = document.getElementById('fiscalyear').value;
		var title = "selectyear.php?fiscalyear=";
		var full = title.concat(com);
		window.location = full;
	}
</script>

<?php
	include '../smallfooter.php';
?>
