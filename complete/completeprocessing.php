<?php
	$title = 'Boiler Books';
	$completeactive = "active";
	include '../menu.php';
?>

<?php
include '../dbinfo.php';
echo '<div class="container">';
// define variables and set to empty values
$cost = $comments = $receipt = $purchasedate = "";
$committee = $_SESSION['committeec'];
$item = $_SESSION['itemc'];
$purchaseID = $_SESSION['purchaseIDc'];
if ($purchaseID == '') {
	echo 'no purchase';
	header("Location: index.php");
}
else {
	$sqler = $uploaderr = '';
	$comments = test_input($_POST["comments"]);
	$cost = test_input($_POST["cost"]);
	$purchasedate = test_input($_POST["purchasedate"]);
	$purchasedateorig = $purchasedate;

	$purchasedate = str_replace('-','/',$purchasedate);
	$purchasedate = date('Y-m-d H:i:s', strtotime($purchasedate));  
	$purchasedatetemp = $purchasedate;
	$receipt = $servername . "/";
	$target_dir = "../receipts/";
	$target_dir_save = "/receipts/";
	$uploadOk = 1;
	$FileType = pathinfo($target_dir . basename($_FILES["fileToUpload"]["name"]),PATHINFO_EXTENSION);
	$target_file = $target_dir . $committee . "_" . $item . "_" . $purchaseID . "." . $FileType;
	$target_file_save = $target_dir_save . $committee . "_" . $item . "_" . $purchaseID . "." . $FileType;
	// Check if file already exists
	if (file_exists($target_file)) {
		$uploaderr = $uploaderr . " Your file already exists on the server";
		$uploadOk = 0;
	}
	// Check file size
	// file size must be less than 5MB
	if ($_FILES["fileToUpload"]["size"] > 5000000) {
		$uploaderr = $uploaderr . "Your reimbursement cert is larger than 5MB";
		$uploadOk = 0;
	}
	// Allow certain file formats
	if($FileType != "pdf" and $FileType != "PDF" and $FileType != "jpg" and $FileType != "jpeg"and $FileType != "JPG"and $FileType != "JPEG") {
		$uploaderr = $uploaderr . "Only PDFs and JPEGs are allowed";
		//echo $FileType;
		$uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		;
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
			//echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.<br>";
			$receipt = str_replace(' ', '%20', $target_file_save);
		} else {
			$uploaderr = $uploaderr . "There was an error uploading your file";
		}
	}
	if ($uploadOk != 0)
	{
			try {
				$cost = test_input(str_replace('$','',$cost));
			    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			    // set the PDO error mode to exception
			    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			    $sql = "UPDATE Purchases SET modifydate = NOW(), purchasedate='$purchasedate', cost='$cost', status='Purchased', comments='$comments',
				receipt='$receipt' WHERE Purchases.purchaseID = '$purchaseID'";
				// use exec() because no results are returned
			    $conn->exec($sql);
			    //echo "New record created successfully";
			    //echo $sql;
			    }
			catch(PDOException $e)
			    {
			    $sqler =  $sql . "<br>" . $e->getMessage();
			    }
			$conn = null;
			 $to = "purdue.ieee.treasurer@gmail.com";
			 $subject = "New purchase by $committee";
			 $message = "<p>Please visit money.pieee.org at your earliest convenience to begin the reimbursement process for $item.</p>";
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
			$_SESSION['usernamec'] = '';
			$_SESSION['itemc'] =  '';
			$_SESSION['reasonc'] =  '';
			$_SESSION['vendorc'] = '';
			$_SESSION['committeec'] = '';
			$_SESSION['categoryc'] = '';
			$_SESSION['costc'] = '';
			$_SESSION['statusc']= '';
			$_SESSION['commentsc']= '';
			$_SESSION['statusc']= '';
			$_SESSION['purchaseIDc']= '';
			
	}
}

echo "<div style='text-align:center; line-height: 2.5em'>";

if ($uploaderr == '' && $sqler == '') {
				//header('Location: index.php');
				echo "<h1> Your purchase was succesful </h1>";
			}
			else {
				
				echo "<h1> Oops... something went wrong</h1>";
				
				echo "<h2>" . $uploaderr . "</h2><br>";

				echo "<h2> Debug Info </h2>";
				echo "<h4>";
				echo "Purchase Date Original: " . $purchasedateorig . "<br><br>";
				echo "Changed Purchase Date: " . $purchasedate . "<br><br>";
				echo "File Type: " . $FileType . "<br><br>";
				echo "File Size: " . $_FILES["fileToUpload"]["size"] . "<br><br>";
				echo "Receipt: " . $receipt . "<br><br>";
				echo "Target File: " . $target_file . "<br><br>";
				echo "Target File Save: " . $target_file_save . "<br><br>";

				if ($sqler != '') {
					echo "SQL Statement <br><br>";
					echo $sqler . "<br>";
				}
				echo "</h4>";
			}
			

echo "</div>";
echo '</div>';

?>

