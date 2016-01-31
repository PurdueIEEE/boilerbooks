<?php
$title = 'Boiler Books';
$approveactive = "active";
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
	//$sql = "SELECT purchaseID, item FROM Purchases WHERE Purchases.status = 'Requested'";
	$sql = "SELECT p.purchaseID, p.item FROM Purchases p
	INNER JOIN approval a on p.committee = a.committee
	WHERE p.status = 'Requested'
	AND a.username = '$usr'
	AND (a.category = p.category OR a.category = '*')
	AND p.cost <= (SELECT MAX(ap.ammount) FROM approval ap
	WHERE ap.username = '$usr'
	AND ap.committee = p.committee)";
	//$stmt->execute();


	foreach ($conn->query($sql) as $row) {
		$items .= '<option value="';
		$items .= $row['purchaseID'];
		$items .= '">';
		$items .= $row['item'];
		$items .= '</option>\n';

	}
	//echo $items;


}
catch(PDOException $e)
{
	echo $sql . "<br>" . $e->getMessage();
}

$conn = null;
?>

<!-- Page Content -->

<form class="form-horizontal" action="finditem.php" method="post">>
	<fieldset>

		<!-- Form Name -->
		<legend></legend>

		<div class="form-group">
			<label class="col-md-4 control-label" for="Committee">Item to Approve</label>
			<div class="col-md-4">
				<select id="currentitem" name="currentitem" class="form-control" value="113">
					<?php echo $items; ?>
				</select>
			</div>
		</div>


		<!-- Button -->
		<div class="form-group">
			<label class="col-md-4 control-label" for="submit"></label>
			<div class="col-md-4">
				<button id="submit" name="submit" class="btn btn-primary">Search</button>
			</div>
		</div>

	</fieldset>
</form>






<!-- Page Content -->

<form class="form-horizontal" action="approvepurchaseprocessing.php" method="post">
	<fieldset>

		<!-- Form Name -->
		<legend></legend>

		<div class="row">
			<div class="col-sm-4"></div>
			<div class="col-sm-2">
				<h4 class='text-left'>Purchase Request by:</h4>
			</div>
			<div class="col-sm-6">
				<h4><em><?php echo $_SESSION['name']; ?></em></h4>
			</div>
		</div>

		<div class="form-group">
			<label class="col-md-4 control-label" for="Committee">Committee</label>
			<div class="col-md-4">
				<select id="committee" name="committee" class="form-control">
					<option <?php echo $_SESSION['generalieee']; ?> value="General IEEE">General IEEE</option>
					<option <?php echo $_SESSION['aerialactive']; ?> value="Aerial Robotics">Aerial Robotics</option>
					<option <?php echo $_SESSION['computersocietyactive']; ?> value="Computer Society">Computer Society</option>
					<option <?php echo $_SESSION['embsactive']; ?> value="EMBS">EMBS</option>
					<option <?php echo $_SESSION['learningactive']; ?> value="Learning">Learning</option>
					<option <?php echo $_SESSION['racingactive']; ?> value="Racing">Racing</option>
					<option <?php echo $_SESSION['rovactive']; ?> value="ROV">ROV</option>
					<option <?php echo $_SESSION['rocketactive']; ?> value="Rocket">Rocket</option>
				</select>
			</div>
		</div>

		<!-- Text input-->
		<div class="form-group">
			<label class="col-md-4 control-label" for="item">Item Being Purchased</label>
			<div class="col-md-4">
				<input id="item" name="item" type="text" placeholder="Select item above to view" class="form-control input-md" value="<?php echo $_SESSION['item']; ?>" required="">

			</div>
		</div>

		<!-- Text input-->
		<div class="form-group">
			<label class="col-md-4 control-label" for="reason">Reason Being Purchased</label>
			<div class="col-md-4">
				<input id="reason" name="reason" type="text" placeholder="Select item above to view" class="form-control input-md" required="" value="<?php echo $_SESSION['reason']; ?>">

			</div>
		</div>

		<!-- Text input-->
		<div class="form-group">
			<label class="col-md-4 control-label" for="vendor">Vendor</label>
			<div class="col-md-4">
				<input id="vendor" name="vendor" type="text" placeholder="Select item above to view" class="form-control input-md" required="" value="<?php echo $_SESSION['vendor']; ?>">

			</div>
		</div>


		<!-- Text input-->
		<div class="form-group">
			<label class="col-md-4 control-label" for="cost">Cost</label>
			<div class="col-md-4">
				<input id="cost" name="cost" type="number" step = "0.01" placeholder="Select item above to view" class="form-control input-md" required="" value="<?php echo $_SESSION['cost']; ?>">

			</div>
		</div>

		<!-- Textarea -->
		<div class="form-group">
			<label class="col-md-4 control-label" for="comments">Comments</label>
			<div class="col-md-4">
				<textarea class="form-control" id="comments" name="comments"><?php echo $_SESSION['comments']; ?></textarea>
			</div>
		</div>

		<div class="form-group">
			<label class="col-md-4 control-label" for="category">Category</label>
			<div class="col-md-4">
				<textarea class="form-control" id="category" name="category"><?php echo $_SESSION['category']; ?></textarea>
			</div>
		</div>




		<!-- Select Basic -->
		<div class="form-group">
			<label class="col-md-4 control-label" for="category">Funding Source</label>
			<div class="col-md-4">
				<select id="fundsource" name="fundsource" class="form-control">
					<option value="BOSO">BOSO</option>
					<option value="Cash">Cash</option>
				</select>
			</div>
		</div>

		<!-- Select Basic -->
		<div class="form-group">
			<label class="col-md-4 control-label" for="category">Approve/Deny</label>
			<div class="col-md-4">
				<select id="status" name="status" class="form-control">
					<option value="Denied">Deny</option>
					<option value="Approved">Approve</option>
				</select>
			</div>
		</div>

		<!-- Button -->
		<div class="form-group">
			<label class="col-md-4 control-label" for="submit"></label>
			<div class="col-md-4">
				<button id="submit" name="submit" class="btn btn-primary">Approve/Deny</button>
			</div>
		</div>

	</fieldset>
</form>


<?php
include '../smallfooter.php';
?>
