<?php
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";

// define variables and set to empty values
$first = $last = $email = $address = $city = $state = $zip = $usr = $cert = $password1 = $password2 = "";

$first = test_input($_POST["first"]);
$last = test_input($_POST["last"]);
$email = test_input($_POST["email"]);
$address = test_input($_POST["address"]);
$city = test_input($_POST["city"]);
$state = test_input($_POST["state"]);
$zip = test_input($_POST["zip"]);
$usr = test_input($_POST["username"]);
$password1 = ($_POST["password1"]);
$password2 = ($_POST["password2"]);




$target_dir = "certs/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image

// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "pdf") {
    echo "Sorry, only PDFs are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}









function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

if ($password1 != $password2)
{

	
	echo "Passwords must match";
}

else
{
	$password1 = password_hash($password1,PASSWORD_DEFAULT);
	$password2 = password_hash($password1,PASSWORD_DEFAULT);
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = "INSERT INTO Users (first,last,email,address,city,state,zip,cert,username,password)
		VALUES ('$first', '$last', '$email', '$address', '$city', '$state', '$zip', '$cert', '$usr', '$password1')";

		
		// use exec() because no results are returned
		$conn->exec($sql);
		echo "New record created successfully";
		}
	catch(PDOException $e)
		{
		echo $sql . "<br>" . $e->getMessage();
		}

	$conn = null; 
}

?>
