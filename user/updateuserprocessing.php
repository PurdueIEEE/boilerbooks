<?php
include '../menu.php';
include '../dbinfo.php';

// define variables and set to empty values
$first = $last = $email = $address = $city = $state = $zip = $usr = $cert = $password1 = $password2 = "";

$first = test_input($_POST["first"]);
$last = test_input($_POST["last"]);
$email = test_input($_POST["email"]);
$address = test_input($_POST["address"]);
$city = test_input($_POST["city"]);
$state = test_input($_POST["state"]);
$zip = test_input($_POST["zip"]);
//$usr = test_input($_POST["username"]);
$usr = $_SESSION['user'];
$curusr =   $_SESSION['user'];


//keep same cert

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sql = "SELECT cert FROM Users U
	WHERE U.username = '$curusr'";

	foreach ($conn->query($sql) as $row) {
		$cert = $row['cert'];

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

	$sql = "UPDATE Users SET modifydate = NOW(), first='$first', last='$last', email = '$email', address = '$address',
	city='$city', state = '$state', zip='$zip', cert='$cert', username='$usr' WHERE username='$curusr'";

	// Prepare statement
	$stmt = $conn->prepare($sql);

    // execute the query
	$stmt->execute();
	$_SESSION['user'] = $usr;
}
catch(PDOException $e) {
	echo $sql . "<br>" . $e->getMessage();
}


if ($sqlerr == '') {

	echo "<div class='container'>";
	echo "<h3>Your updated information:</h3>";
	echo "<br> <p>";
	echo $first ."<br>";
	echo $last ."<br>";
	echo $email ."<br>";
	echo $address ."<br>";
	echo $city ."<br>";
	echo $state ."<br>";
	echo $zip ."<br>";
	echo $cert ."<br>";
	echo "usr: " . $usr ."<br>";
	echo "</div>";

	//header("Location: ../loggedin.php");
}
else {
	echo "There was an error. View the messages below and try again";
	echo $uploaderr;
	echo $sqlerr;
	//header("Location: newuser.php");
}
?>
