<?php
	$title = 'Boiler Books';
	include '../menu.php';
?>



<?php
include '../dbinfo.php';
$dbname = "ieee-money";
$stuff = '';
$item = $_SESSION['item'];

$names = '';
$emails = '';


$currentitemid = $_SESSION['itemid'];
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT CONCAT(U.first, ' ', U.last) name, U.email, a.committee FROM approval a
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

		$emails .= $row['email'];
		$emails .= ', ';

		$committee = $row['committee'];

	}
	$names = rtrim($names,', ');
	$emails = rtrim($emails,', ');


}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null;




 $to = $emails;
 $subject = "New Purchase from $committee";

 $user = $_SESSION['user'];
 $message = "<p>A request to buy $item has been made by $user.
 Please visit money.pieee.org at your earliest convenience to approve or deny the request.</p>";

 $header = "From:ieeeboilerbooks@gmail.com \r\n";
 $header .= "MIME-Version: 1.0\r\n";
 $header .= "Content-type: text/html\r\n";

 if ($sendemail == 1) {
	 $retval = mail ($to,$subject,$message,$header);

	 if( $retval == true ) {
	 //echo "Message sent successfully...";
	 }else {
	 //echo "Message could not be sent...";
	 }
 }

?>

<div class = "container">
<h2>Purchase successfully submitted!</h2>
<p>Your purchase request for <?php echo $_SESSION['item']; ?> will soon be approved or denied.</p>
<p>It can be reviewed by: <?php echo $names; ?>.</p>

</div>




<?php
	$_SESSION['item'] = '';
	include '../smallfooter.php';
?>
