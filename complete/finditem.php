<?php 
	session_start();
	if (!isset($_SESSION['user']))
	{
		header("Location: ../index.php");
		die();
	}
?>


<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";
$stuff = '';
$currentitem = $_POST["currentitem"];
$_SESSION['currentitem'] = $currentitem;
 

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT username, item, purchasereason, vendor, committee, category, cost, status, comments FROM Purchases WHERE Purchases.purchaseID = '$currentitem'";
	//$stmt->execute();
	
	
	foreach ($conn->query($sql) as $row) {

		
		$_SESSION['username'] = $row['username'];
		$_SESSION['item'] =  $row['item'];
		$_SESSION['reason'] =  $row['purchasereason'];
		$_SESSION['vendor'] = $row['vendor'];
		$_SESSION['committee'] = $row['committee'];
		$_SESSION['category'] = $row['category'];
		$_SESSION['cost'] = $row['cost'];
		$_SESSION['status']= $row['status'];
		$_SESSION['comments']= $row['comments'];
	}

	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null; 

$_SESSION['aerialactive'] = '';
$_SESSION['computersocietyactive'] = '';
$_SESSION['embsactive'] = '';
$_SESSION['learningactive'] = '';
$_SESSION['racingactive'] = '';
$_SESSION['rovactive'] = '';
$_SESSION['rocketactive'] = '';


if ($_SESSION['committee'] == 'Aerial Robotics') {
	$_SESSION['aerialactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'Computer Society') {
	$_SESSION['computersocietyactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'EMBS') {
	$_SESSION['embsactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'Learning') {
	$_SESSION['learningactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'Racing') {
	$_SESSION['racingactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'ROV') {
	$_SESSION['rovactive'] = 'selected';
}
elseif ($_SESSION['committee'] == 'Rocket') {
	$_SESSION['rocketactive'] = 'selected';
}
header("Location: index.php");





/*
      <option selected value="Aerial Robotics">Aerial Robotics</option>
      <option value="Computer Society">Computer Society</option>
      <option value="EMBS">EMBS</option>
      <option value="Learning">Learning</option>
      <option value="Racing">Racing</option>
      <option value="ROV">ROV</option>
      <option value="Rocket">Rocket</option>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="item">Item Being Purchased</label>  
  <div class="col-md-4">
  <input id="item" name="item" type="text" placeholder="Resistors, screws, etc." class="form-control input-md" required="">
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="reason">Reason Being Purchased</label>  
  <div class="col-md-4">
  <input id="reason" name="reason" type="text" placeholder="For testing, building claw, etc." class="form-control input-md" required="">
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="vendor">Vendor</label>  
  <div class="col-md-4">
  <input id="vendor" name="vendor" type="text" placeholder="McMaster, Digikey, etc." class="form-control input-md" required="">
    
  </div>
</div>


<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="cost">Cost</label>  
  <div class="col-md-4">
  <input id="cost" name="cost" type="text" placeholder="$156.56" class="form-control input-md" required="">
    
  </div>
</div>

<!-- Textarea -->
<div class="form-group">
  <label class="col-md-4 control-label" for="comments">Comments</label>
  <div class="col-md-4">                     
    <textarea class="form-control" id="comments" name="comments"></textarea>
  </div>
</div>

<!-- Select Basic -->
<div class="form-group">
  <label class="col-md-4 control-label" for="category">Category</label>
  <div class="col-md-4">
    <select id="category" name="category" class="form-control">
      <option value="Electrical">Electrical</option>
      <option value="Mechanical">Mechanical</option>
      <option value="Software">Software</option>
    </select>
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
    <select id="category" name="category" class="form-control">
      <option value="Denied">Deny</option>
      <option value="Approved">Approve</option>
    </select>
  </div>
</div>
	*/

?>