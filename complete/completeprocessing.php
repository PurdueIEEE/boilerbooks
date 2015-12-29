<?php
	$title = 'Boiler Books';
	$completeactive = "active";
	include '../menu.php';
?>

<?php 
$servername = "localhost";
$username = "testuser";
$password = "password123";
$dbname = "ieee-money";



// define variables and set to empty values
$cost = $comments = $receipt = "";
$committee = $_SESSION['committee'];
$item = $_SESSION['item'];
$purchaseID = $_SESSION['purchaseID'];

$sqler = $uploaderr = '';
$comments = test_input($_POST["comments"]);
$cost = test_input($_POST["cost"]);


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}


 

$receipt = "money.krakos.net/";


$target_dir = "../receipts/";
$target_dir_save = "/receipts/";
$target_file = $target_dir . $committee . "_" . $item . "_" . $purchaseID . ".pdf";
$target_file_save = $target_dir_save . $committee . "_" . $item . "_" . $purchaseID . ".pdf";
$uploadOk = 1;


$FileType = pathinfo($target_dir . basename($_FILES["fileToUpload"]["name"]),PATHINFO_EXTENSION);
echo "Here:" . "<br>";
echo $FileType . "<br>";
echo $$_FILES["fileToUpload"]["name"] . "<br>";

// Check if file already exists
if (file_exists($target_file)) {
	$uploaderr = $uploaderr . "Sorry, file already exists.";
	$uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
	$uploaderr = $uploaderr . "Sorry, your reimbursement cert is too large.";
	$uploadOk = 0;
}
// Allow certain file formats
if($FileType != "pdf") {
	$uploaderr = $uploaderr . "Sorry, only PDFs are allowed for the reimbursement cert.";
	$uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
	$uploaderr = $uploaderr . "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
	if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
		echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
		$receipt = $target_file_save;
	} else {
		$uploaderr = $uploaderr . "Sorry, there was an error uploading your file.";
	}
}

 

try {
	$cost = test_input(str_replace('$','',$cost));
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "UPDATE Purchases SET cost='$cost', status='Purchased', comments='$comments', 
	receipt='$receipt' WHERE Purchases.purchaseID = '$purchaseID'";
	
	
	// use exec() because no results are returned
    $conn->exec($sql);
    echo "New record created successfully";
    }
catch(PDOException $e)
    {
    $sqler =  $sql . "<br>" . $e->getMessage();
    }

$conn = null; 


$_SESSION['username'] = '';
$_SESSION['item'] =  '';
$_SESSION['reason'] =  '';
$_SESSION['vendor'] = '';
$_SESSION['committee'] = '';
$_SESSION['category'] = '';
$_SESSION['cost'] = '';
$_SESSION['status']= '';
$_SESSION['comments']= '';
$_SESSION['status']= '';
$_SESSION['purchaseID']= '';



if ($uploaderr == '' and $sqler == '') {
	header('Location: index.php'); 
}
else {
	echo "There were errors <br> '";
	echo $uploaderr . "'<br>'";
	echo $sqler . "'<br>";
}


?>