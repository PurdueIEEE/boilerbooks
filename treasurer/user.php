<?php
	$title = 'Boiler Books';
	include '../header.php';
	include '../menu.php';
?>

<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";
$usr = $_SESSION['user'];


$usrlookup = test_input($_GET['usrlookup']);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
  return $data;
}


try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT * FROM Users U
		WHERE U.username = '$usrlookup'
		AND '$usr' = (
		    SELECT U3.username FROM Users U3
		    INNER JOIN approval A ON U3.username = A.username
		    WHERE A.role = 'treasurer')";

	foreach ($conn->query($sql) as $row) {
		$first = $row['first'];
		$last = $row['last'];
		$email = $row['email'];
		$address = $row['address'];
		$city = $row['city'];
		$state = $row['state'];
		$zip = $row['zip'];
		$cert = $row['cert'];
		$usr = $row['username'];

	}
		//echo $items;


	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;
?>


<div class='container'>
	<div class='container'>
	  <label class="col-md-4">First Name</label>
	  <div class="col-md-4">
	  	<?php echo $first ?>
	  </div>
	</div>

	<div class='container'>
		<label class="col-md-4">Last Name</label>
		<div class="col-md-4">
		  <?php echo $last ?>
		</div>
	</div>

	<div class='container'>
		<label class="col-md-4">Email</label>
		<div class="col-md-4">
		  <?php echo $email ?>
		</div>
	</div>

	<div class='container'>
		<label class="col-md-4">Address</label>
		<div class="col-md-4">
		  <?php echo $address ?>
		</div>
	</div>

	<div class='container'>
		<label class="col-md-4">City</label>
		<div class="col-md-4">
	  	<?php echo $city ?>
	  </div>
	</div>


	<div class='container'>
		<label class="col-md-4">State</label>
		<div class="col-md-4">
			<?php echo $state ?>
	  </div>
	</div>

	<div class='container'>
		<label class="col-md-4">ZIP</label>
		<div class="col-md-4">
	  	<?php echo $zip ?>
		</div>
	</div>

	<div class='container'>
		<label class="col-md-4"><a href='../user/<?php echo $cert ?>'>Reimbursement Certificate</a></label>
	</div>

</div>




<?php include '../smallfooter.php';?>
