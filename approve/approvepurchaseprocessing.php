<?php
	session_start();
	if (!isset($_SESSION['user']))
	{
		header("Location: ../index.php");
		die();
	}
?>

<?php
include '../dbinfo.php';

// define variables and set to empty values
$item = $reason = $vendor = $committee = $cost = $comments = $category = "";

$item = test_input($_POST["item"]);
$reason = test_input($_POST["reason"]);
$vendor = test_input($_POST["vendor"]);
$committee = test_input($_POST["committee"]);
$cost = test_input($_POST["cost"]);
$comments = test_input($_POST["comments"]);
$category = test_input($_POST["category"]);
$stat = test_input($_POST["status"]);
$fundsource = test_input($_POST["fundsource"]);
$usr = $_SESSION['user'];
$purchaseid = $_SESSION['currentitem'];



try {
	$cost = test_input(str_replace('$','',$cost));
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "UPDATE Purchases SET modifydate = NOW(), approvedby='$usr', item='$item', purchasereason='$reason', vendor='$vendor',
	committee='$committee', category='$category', cost='$cost', status='$stat', fundsource='$fundsource',
	comments='$comments' WHERE Purchases.purchaseID = '$purchaseid'";

    //$sql = "INSERT INTO Purchases (item)
	//VALUES ('$item')";

	// use exec() because no results are returned
    $conn->exec($sql);
    echo "New record created successfully";
    }
catch(PDOException $e)
    {
    echo $sql . "<br>" . $e->getMessage();
    }

$conn = null;

 $to = $_SESSION['email'];
 $subject = "Your request has been $stat";

 $message = "<p>Please visit money.pieee.org at your earliest convenience to finish the purchase for $item.</p>";

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


// Reset all values
$_SESSION['currentitem'] = '';
$_SESSION['username'] = '';
$_SESSION['item'] =  '';
$_SESSION['reason'] =  '';
$_SESSION['vendor'] = '';
$_SESSION['committee'] = '';
$_SESSION['category'] = '';
$_SESSION['cost'] = '';
$_SESSION['status']= '';
$_SESSION['comments']= '';
$_SESSION['email']= '';
$_SESSION['name'] = '';
?>

<?php header('Location: index.php'); ?>
