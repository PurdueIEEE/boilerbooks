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

/*
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
*/


$currentitemid = $_SESSION['itemid'];
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT CONCAT(U.first, ' ', U.last) name FROM approval a
INNER JOIN Users U
ON U.username = a.username

WHERE a.committee = (
	SELECT P.committee FROM Purchases P WHERE P.purchaseID = '$currentitemid')
AND a.ammount >= (
	SELECT P.cost FROM Purchases P WHERE P.purchaseID = '$currentitemid')
AND (a.category = (
	SELECT P.category FROM Purchases P WHERE P.purchaseID = '$currentitemid')
    OR a.category = '*')
    ";
	//$stmt->execute();


	foreach ($conn->query($sql) as $row) {


		$names .= $row['name'];
		$names .= ', ';

	}
	$names = rtrim($names,', ');



}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;





?>

<div class = "container">
<h2>Purchase successfully submitted!</h2>
<p>Your purchase request for <?php echo $_SESSION['item']; ?> will soon be approved or denied.</p>
<p>It can be reviewed by: <?php echo $names; ?>.</p>
</div>




<?php
	include '../smallfooter.php';
?>
