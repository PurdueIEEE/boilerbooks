<?php
    /*** Yada yada yada */

    session_start();
	if (!isset($_SESSION['user'])) {
		header("Location: ../index.php");
		die();
	}
?>

<?php
    include '../../dbinfo.php';
    $returnStat = "200";

    /*** Add completion info to database ***/
	// define variables and set to empty values
	$cost = $comments = $receipt = $purchasedate = $committee = $item = $purchaseID = $usr = "";
	$committee = $_SESSION['committeec'];
	$item = $_SESSION['itemc'];
	$purchaseID = $_SESSION['purchaseIDc'];
	$usr = $_SESSION['user'];

    if ($purchaseID == '') {
		header("Location: index.php");
	}
?>
