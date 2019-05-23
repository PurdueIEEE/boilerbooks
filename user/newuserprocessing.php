<?php
include '../header.php';
include '../dbinfo.php';

// define variables and set to empty values
$first = $last = $email = $address = $city = $state = $zip = $usr = $cert = $password1 = $password2 = $ieeecode = "";

$first = test_input($_POST["first"]);
$last = test_input($_POST["last"]);
$email = test_input($_POST["email"]);
$address = test_input($_POST["address"]);
$city = test_input($_POST["city"]);
$state = test_input($_POST["state"]);
$zip = test_input($_POST["zip"]);
$usr = test_input($_POST["username"]);
$ieeecode = test_input($_POST["ieeecode"]);
$password1 = ($_POST["password1"]);
$password2 = ($_POST["password2"]);

$uploaderr = '';


echo "The upload code you entered is: ";
echo $ieeecode . "<br>";
if ($ieeecode != $uploadcode) {
  $uploaderr = $uploaderr . "Improper upload code <br>";
}
else if ($password1 != $password2)
{
  $uploaderr = $uploaderr . "Passwords must match <br>";
}

else {
  $password1 = password_hash($password1,PASSWORD_DEFAULT);
  $password2 = password_hash($password1,PASSWORD_DEFAULT);
  try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "INSERT INTO Users (first,last,email,address,city,state,zip,cert,username,password)
    VALUES ('$first', '$last', '$email', '$address', '$city', '$state', '$zip', '', '$usr', '$password1')";


    // use exec() because no results are returned
    $conn->exec($sql);
    $sqlerr = '';
  }
  catch(PDOException $e)
  {
    $sqlerr = $sql . "<br>" . $e->getMessage();
    $uploaderr = $uploaderr . "There was an unknown error updating the database; refresh and try again.<br>";
  }

  $conn = null;
}



if ($uploaderr == '' and $sqlerr == '') {
  header("Location: ../index.php");
}
else {
  echo "There was an error. Please view the messages below, go back, and try again <br>";
  //echo $uploaderr . "<br><br>";
  //echo $sqlerr . "<br><br>";
  echo $uploaderr;
  //header("Location: newuser.php");
}

include '../smallfooter.php';
?>
