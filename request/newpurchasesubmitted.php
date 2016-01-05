<?php
	$title = 'Boiler Books';
	include '../menu.php';
?>



<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";
$stuff = '';
$item = $_SESSION['item'];
 
 
try {
	 
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT item, modifydate, purchaseID FROM Purchases P WHERE item = '$item'
			ORDER BY modifydate DESC LIMIT 1";
	
	
	foreach ($conn->query($sql) as $row) {

		
		$currentitem = $row['purchaseID'];
		
	}
	 
	
}

catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null; 




try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT CONCAT(U.first, ' ', U.last) name, item FROM Purchases P
			INNER JOIN Users U ON U.username = P.username
			WHERE P.purchaseID = '$currentitem'";
	//$stmt->execute();
	
	
	foreach ($conn->query($sql) as $row) {

		
		$names .= $row['name'];
		$names .= ', ';
		$item =  $row['item'];

	}
	
	
	
}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null; 





?>

<div class = "container">
<h2>Purchase successfully submitted!</h2>
<p>Your purchase request for <?php echo $item; ?> will soon be approved or denied.</p>
<p>It will be reviewed by <?php echo $names; ?>.</p>
</div>



		
<?php 
	include '../smallfooter.php';
?>