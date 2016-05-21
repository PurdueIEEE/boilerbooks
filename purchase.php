<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include 'menu.php';
?>

<?php
	include 'dbinfo.php';

	$purchaseid = test_input($_GET["purchaseid"]);

	if ($purchaseid != $_SESSION['purchaseid']) {
		$headerStuff = "Location: /api/purchaseid/index.php?purchaseid=" . $purchaseid;
	 	header($headerStuff); 	
	}



?>

<div>
	<div class="well">
		<h3 class="text-center">Purchase#<?php echo $purchaseid?>: <?php echo $_SESSION['item']?></h3>
		<p class="text-center"><em>Last updated <?php echo $_SESSION['mdate']?> EST</em></p>
	</div>

	<div class="row">
	<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Purchased by:</strong> <?php echo $_SESSION['purchaseby']?></p>
		</div>
		<div class="col-sm-3" class="text-center">
			<p><strong>Purchase date:</strong> <?php echo $_SESSION['date']?></p>

		</div>
		<div class="col-sm-2"></div>
	</div>

	<br>
	
	<div class="row">
	<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Purchase reason:</strong> <?php echo $_SESSION['purchasereason']?></p>
		</div>
		<div class="col-sm-3">
			<p><strong>Status:</strong> <?php echo $_SESSION['status']?></p>

		</div>
		<div class="col-sm-2"></div>
	</div>

	<br>
	
	<div class="row">
	<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Cost:</strong> $<?php echo $_SESSION['cost']?></p>
		</div>
		<div class="col-sm-3">
			<p><strong>Vendor:</strong> <?php echo $_SESSION['vendor']?></p>

		</div>
		<div class="col-sm-2"></div>
	</div>

	<br>
	
	<div class="row">
	<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Category:</strong> <?php echo $_SESSION['category']?></p>
		</div>
		<div class="col-sm-3">
			<p><strong>Approved by:</strong> <?php echo $_SESSION['approvedby']?></p>

		</div>
		<div class="col-sm-2"></div>
	</div>

	<br>
	
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-9">
			<p><strong>Comments:</strong> <?php echo $_SESSION['comments']?></p>
		</div>
	</div>

	<br>
	<?php echo $_SESSION['iframestuff'] ?>

</div>


<?php
	include '../smallfooter.php';
?>
