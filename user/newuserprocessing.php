<?php
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
$usr = test_input($_POST["username"]);
$password1 = ($_POST["password1"]);
$password2 = ($_POST["password2"]);

$uploaderr = '';


$target_dir = "certs/";
$target_file = $target_dir . $first . "_" . $last . "_" . $usr . ".pdf";
$uploadOk = 1;


$FileType = pathinfo($target_dir . basename($_FILES["fileToUpload"]["name"]),PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image

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
    $cert = $target_file;
  } else {
    $uploaderr = $uploaderr . "Sorry, there was an error uploading your file.";
  }
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
    $sqlerr = '';
  }
  catch(PDOException $e)
  {
    $sqlerr = $sql . "<br>" . $e->getMessage();
  }

  $conn = null;
}


if ($uploaderr == '' and $sqlerr == '') {
  header("Location: ../index.php");
}
else {
  echo "There was an error. View the messages below and try again";
  echo $uploaderr;
  echo $sqlerr;
  //header("Location: newuser.php");
}
?>
