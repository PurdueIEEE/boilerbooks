<!--
This file is used to check if the current users has approval powers for just one committee.
If that is the case, it defaults to loading that committee. It sets the `onlyCommittee`
_SESSION variable so this check is executed and executed once.

-Grant Geyer
-->

<?php
	$title = 'Boiler Books';
	$g_active_page = "committee";
?>

<?php
include '../dbinfo.php';
$items = '';
$items2 = '';
$usr = $_SESSION['user'];
$fiscalyear = $_SESSION['fiscalyear'];


try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$sql = "SELECT a.username, a.committee FROM approval a WHERE a.username = '$usr'";

	$connQuery = $conn->query($sql);
	if($connQuery->rowCount() === 1) {
		foreach ($connQuery as $row) {
			$committee = $row['committee'];
		}
	}
} catch(PDOException $e) {
	echo $sql . "<br>" . $e->getMessage();
}
$conn = null;
$_SESSION['onlyCommittee'] = True;

if($committee == '') {
	header("Location: index.php");
} else {
	header("Location: selectcommittee.php?committee=" . $committee);
}
?>
