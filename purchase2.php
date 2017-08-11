<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include 'menu.php';
	include 'dbinfo.php';
	$decode = 1;

	$purchaseid = test_input($_GET["purchaseid"]);
	$url = "https://" . $_SERVER[HTTP_HOST] . "/api/purchaseid/?purchaseid=" . $purchaseid;
	$jsonObj = file_get_contents($url);
	$values = json_decode($jsonObj, TRUE);
?>


<div class = "container">
	<div class="well">
		<div class="col-sm-6">
			<h3 class="text-right">Purchase #<?php echo $purchaseid?>:</h3>
		</div>
		<div class="col-sm-6">
			<h3 class="text-left" contenteditable="true"><?php echo $values['item']?></h3>
		</div>
		<p class="text-center"><em>Last updated <?php echo $values['mdate']?> EST</em></p>
	</div>

	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4" class="text-center">
			<p><strong>Purchased by:</strong> <?php echo $values['purchasedby']?></p>
		</div>
		<div class="col-sm-5" class="text-center">
			<p><strong>Purchase date:</strong> <?php echo $values['date']?></p>
		</div>
	</div>

	
	
	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><strong>Purchase reason:</strong> <?php echo $values['purchasereason']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Status:</strong> <?php echo $values['status']?></p>
		</div>
	</div>

	
	
	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><strong>Cost:</strong> $<?php echo $values['cost']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Vendor:</strong> <?php echo $values['vendor']?></p>
		</div>
	</div>

	
	
	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><strong>Category:</strong> <?php echo $values['category']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Approved by:</strong> <?php echo $values['approvedby']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><strong>Committee:</strong> <?php echo $values['committee']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Funding Source:</strong> <?php echo $values['fundsource']?></p>
		</div>
	</div>

	
	
	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><strong>Fiscal Year:</strong> <?php echo $values['fiscalyear']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Comments:</strong> <?php echo $values['comments']?></p>
		</div>
	</div>

	<br>	

	<div class="row">
	<div class="col-sm-2">
	</div>
	<div class="col-sm-8">
		<iframe src= "<?php echo 'https://' . $_SERVER[HTTP_HOST] . $values['receipt']?>" style="position: relative; width: 100%;" height="700">
			<a href="<?php echo 'https://' . $_SERVER[HTTP_HOST] . $values['receipt']?>">Download receipt</a>
		</iframe>
	</div>
	<div class="col-sm-2">
	</div>
	</div>
	<br>

</div>



<?php
	include 'smallfooter.php';
?>
