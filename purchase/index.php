<?php
	$title = 'Boiler Books';
	$mypurchasesactive = "active";
	include '../menu.php';
	include '../dbinfo.php';
	$decode = 1;

	$purchaseid = test_input($_GET["purchaseid"]);
	$url = "https://" . $_SERVER[HTTP_HOST] . "/api/purchaseid/?purchaseid=" . $purchaseid . "&user=" . $_SESSION['user'] . "&apikey=" . $_SESSION['apikey'];
	//echo $url;
	$jsonObj = file_get_contents($url);
	$values = json_decode($jsonObj, TRUE);

	$userIsTreasurer = $_SESSION["userIsTreasurer"];
?>


<div class = "container">
	<div class="well">
		<div class="col-sm-6">
			<h3 class="text-right">Purchase #<?php echo $purchaseid?>:</h3>
		</div>
		<div class="col-sm-6">
			<h3 class="text-left"><?php echo $values['item']?></h3>
		</div>
		<p class="text-center"><em>Last updated <?php echo $values['mdate']?> EST</em></p>
      	<p class="text-center"><a class="btn btn-info" href = <?php echo "treasurer/updatepurchase.php?purchaseid=" . $purchaseid?> roll = "button">Edit Purchase</a></p>

	</div>

	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4" class="text-center">
			<p><strong>Purchased by:</strong> <a href=<?php echo "treasurer/user.php?usrlookup=" . $values['username']?>><?php echo $values['purchasedby']?></a></p>
		</div>
		<div class="col-sm-5" class="text-center">
			<p><strong>Purchase date:</strong> <?php echo $values['date']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Purchase reason:</strong> <?php echo $values['purchasereason']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Status:</strong> <?php echo $values['status']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Cost:</strong> $<?php echo $values['cost']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Vendor:</strong> <?php echo $values['vendor']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Category:</strong> <?php echo $values['category']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Approved by:</strong> <?php echo $values['approvedby']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Committee:</strong> <?php echo $values['committee']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Funding Source:</strong> <?php echo $values['fundsource']?></p>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-4">
			<p><strong>Fiscal Year:</strong> <?php echo $values['fiscalyear']?></p>
		</div>
		<div class="col-sm-5">
			<p><strong>Comments:</strong> <?php echo $values['comments']?></p>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-3">
		</div>
		<div class="col-sm-4">
			<p><a href="<?php echo $values['receipt'] ?>">Open receipt in full tab</a></p>
		</div>
	</div>

	<br>

	<?php
		if ($userIsTreasurer === true) {
	?>
		<div class="row">
			<form class="form-inline" action="/purchase/reuploadprocessing.php" method="post" enctype="multipart/form-data">
				<div class="col-sm-3"></div>
				<div class="col-sm-6" class="form-group">
					<input id="purchaseNumberReup" name="purchaseNumberReup" type="" style="visibility: none;" value=<?php echo $purchaseid; ?> >
					<label class="control-label" for="cost">Change Receipt</label>
					<input id="fileToUpload" name="fileToUpload" type="file" class="btn btn-default" required="" style="display: inline-block;">
					<button id="submit" name="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
		</div>
	<?php
		}
	?>

	<br>

	<div class="row">
	<div class="col-sm-2"></div>
	<div class="col-sm-8">
		<?php
			if($values['receipt'] == '') :
				echo '<h1> <center> There is no receipt for this purchase. </center> </h1>';
			else :
		?>
		<iframe src= "<?php echo 'https://' . $_SERVER[HTTP_HOST] . $values['receipt']?>" style="position: relative; width: 100%;" height="700">
			<a href="<?php echo 'https://' . $_SERVER[HTTP_HOST] . $values['receipt']?>">Download receipt</a>
		</iframe>
		<?php 	endif ?>
	</div>
	<div class="col-sm-2">
	</div>
	</div>
	<br>

</div>



<?php
	include 'smallfooter.php';
?>
