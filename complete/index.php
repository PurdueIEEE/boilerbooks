<?php
	$title = 'Boiler Books';
	$completeactive = "active";
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
	//$sql = "SELECT purchaseID, item FROM Purchases WHERE Purchases.status = 'Requested'";
	$sql = "SELECT p.purchaseID, p.item FROM Purchases p
			INNER JOIN approval a on p.committee = a.committee
			WHERE p.status = 'Approved'
				AND p.username = '$usr'";
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
  <label class="col-md-4 control-label" for="Committee">Item to Complete</label>
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

	<form class="form-horizontal" action="completeprocessing.php" method="post">>
<fieldset>

<!-- Form Name -->
<legend></legend>


<!-- Text input-->
<div class="container">
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-3">
			<h4 class='text-left'>Committee:</h4>
		</div>
		<div class="col-sm-6">
			<h4><em><?php echo $_SESSION['committee']; ?></em></h4> 
		</div>
	</div>
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-3">
			<h4 class='text-left'>Item Being Purchased:</h4>
		</div>
		<div class="col-sm-6">
			<h4><em><?php echo $_SESSION['item']; ?></em></h4> 
		</div>
	</div>
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-3">
			<h4 class='text-left'>Reason Being Purchased:</h4>
		</div>
		<div class="col-sm-6">
			<h4><em><?php echo $_SESSION['reason']; ?></em></h4> 
		</div>
	</div>
		<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-3">
			<h4 class='text-left'>Vendor:</h4>
		</div>
		<div class="col-sm-6">
			<h4><em><?php echo $_SESSION['vendor']; ?></em></h4> 
		</div>
	</div>
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-3">
			<h4 class='text-left'>Category:</h4>
		</div>
		<div class="col-sm-6">
			<h4><em><?php echo $_SESSION['category']; ?></em></h4> 
		</div>
	</div>

	
</div>



<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="cost">Final Cost (Shipping and all)</label>  
  <div class="col-md-4">
  <input id="cost" name="cost" type="text" placeholder="Select item above to view" class="form-control input-md" required="" value="$<?php echo $_SESSION['cost']; ?>">
    
  </div>
</div>


<!-- Textarea -->
<div class="form-group">
  <label class="col-md-4 control-label" for="comments">Comments</label>
  <div class="col-md-4">                     
    <textarea class="form-control" id="comments" name="comments"><?php echo $_SESSION['comments']; ?></textarea>
  </div>
</div>



<!-- Button -->
<div class="form-group">
  <label class="col-md-4 control-label" for="submit"></label>
  <div class="col-md-4">
    <button id="submit" name="submit" class="btn btn-primary">Submit</button>
  </div>
</div>

</fieldset>
</form>


		
<?php 
	include '../smallfooter.php';
?>