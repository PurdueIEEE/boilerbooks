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

// define variables and set to empty values
$oldpassword = $password1 = $password2 = "";

$oldpassword = ($_POST["oldpassword"]);
$password1 = ($_POST["password1"]);
$password2 = ($_POST["password2"]);
$usr = $_SESSION['user'];

if ($password1 != $password2)
{
	echo "Passwords must match";
}
 

try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $conn->prepare("SELECT password FROM Users WHERE Users.username = '$usr'");
	$stmt->execute();
	
	$results = $stmt->fetchAll();
	foreach ($results as $pswd) {
		$dbpsw = $pswd['password'];
	}
	
	

	if (password_verify($oldpassword,$dbpsw))
	{
		$password1 = password_hash($password1,PASSWORD_DEFAULT);
		$password2 = password_hash($password1,PASSWORD_DEFAULT);

		$sql = "UPDATE Users SET password='$password1' WHERE username='$usr'";

		// use exec() because no results are returned
		$conn->exec($sql);
		$conn = null; 

		
		header("Location: http://kylerakos.me/ieee/boilerbooks/loggedin.php");
	}
	else
	{
		header("Location: http://kylerakos.me/ieee/boilerbooks/");
	}
	
	}
catch(PDOException $e)
	{
	echo $sql . "<br>" . $e->getMessage();
	}

$conn = null; 
?>
