<?php
    $completeactive = "active";

    include '../dbinfo.php';
    // define variables and set to empty values
    $purchaseID = test_input($_POST['purchaseNumberReup']);
    $usr = $_SESSION['user'];

    $receipt = "";
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Make sure it is a treasurer making the request
        $sql = "SELECT a.username, a.role FROM approval a WHERE a.username = '$usr' AND a.role = 'treasurer'";
        $connQuery = $conn->query($sql);
        if($connQuery->rowCount() === 0) {
            exit;
        }
        $connQuery->fetchall();  // I think I need to do this so that the query "finishes".
    } catch (PDOException $e) {
        $sqlErr =  "SQL Statement: $sql <br>";
        $sqlErr .= "SQL Error: " . $e->getMessage();

        $uploadErrMessage = $uploadErrMessage . "There was an error inserting the row into the database<br>";
        $isUploadError = true;
        exit;
    }

    if (!empty($purchaseID)) {
        $sql = "SELECT p.purchaseID, p.receipt FROM Purchases p WHERE p.purchaseID = '$purchaseID'";
        $connQuery = $conn->query($sql);
        if($connQuery->rowCount() !== 1) {
            exit;
        } else {
            foreach ($connQuery as $row) {
                $receipt_old = $row['receipt'];
            }
        }

        // Regex with names of each item \/receipts\/(?P<com>[^_]+_??[^_]*?)_(?P<user>[^_]+)_(?P<item>.+?)_(?P<number>[0-9]+)(_reupload_(?<Reup>[0-9]))?\.(?P<exten>pdf|jpg)
        $regex_pattern = "/(?P<pre>\/receipts\/[^_]+_??[^_]*?_[^_]+_.+?_[0-9]+)(_reupload_(?<Reup>[0-9]))?\.(?P<exten>pdf|jpg|png)/";
        preg_match($regex_pattern, $receipt_old, $matches);
        if($matches['Reup'] === '') {
            $reup_number = 1;
        } else {
            $reup_number = $matches['Reup'] + 1;
        }


        $target_dir = "../receipts/";
        $FileType = pathinfo(basename($_FILES["fileToUpload"]["name"]), PATHINFO_EXTENSION);

        $target_file_save = $matches["pre"] . "_reupload_" . $reup_number . "." . strtolower($FileType);
        $target_file = ".." . $target_file_save;

        $isUploadError = false;
        $uploadErrMessage = "";
        $sqlErr = "";

        $okayFileTypes = ['pdf', 'jpeg', 'jpg', 'png'];
        $maxFileSize = 2 * 1024 * 1024; // MB * KB * B

        // Make sure it actually uploaded
        if ($_FILES["fileToUpload"]["size"] == 0) {
            $uploadErrMessage = $uploadErrMessage . "Your receipt file size is 0 bytes.<br>";
            $uploadErrMessage = $uploadErrMessage . "This may be because your file was greater than the max upload size.<br>";
            $uploadErrMessage = $uploadErrMessage . "Make sure your receipt is smaller than 2MB.<br>";
            $isUploadError = true;
        }

        // Check file size
        if ($_FILES["fileToUpload"]["size"] > $maxFileSize) {
            $uploadErrMessage = $uploadErrMessage . "Your receipt must be smaller than 2MB<br>";
            $isUploadError = true;
        }

        // Allow certain file formats
        if (!in_array(strtolower($FileType), $okayFileTypes)) {
            $uploadErrMessage = $uploadErrMessage . "Only PDFs, JPEGs, and PNGs are allowed<br>";
            $isUploadError = true;
        }

        // Check if file already exists
        if (file_exists($target_file)) {
            $uploadErrMessage = $uploadErrMessage . " Your file already exists on the server<br>";
            $isUploadError = true;
        }

        // Only run if we succeed in passing the file checks
        if ($isUploadError === false)  {

            // Attempts to move file to the server
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                $receipt = $target_file_save;

                // Convert png to jpg
                if (strtolower($FileType) == 'png') {
                    $im = new Imagick($target_file);
                    $im->setImageFormat('jpg');

                    $delete_file = $target_file;
                    $target_file = str_replace('png', 'jpg', $target_file);
                    $target_file = str_replace('PNG', 'jpg', $target_file);

                    $im->writeImage($target_file);

                    $receipt = str_replace('png', 'jpg', $receipt);
                    $receipt = str_replace('PNG', 'jpg', $receipt);
                    unlink($delete_file);
                }
            } else {
                $uploadErrMessage = $uploadErrMessage . "Could not transfer file to destination on server<br>";
                $isUploadError = true;
            }
        }

        if ($isUploadError === false)  {
            // Update sql database with the file and purchase info
            try {
                $sql = "UPDATE Purchases SET receipt='$receipt' WHERE Purchases.purchaseID = '$purchaseID'";

                // use exec() because no results are returned
                $conn->exec($sql);
            } catch (PDOException $e) {
                $sqlErr =  "SQL Statement: $sql <br>";
                $sqlErr .= "SQL Error: " . $e->getMessage();

                $uploadErrMessage = $uploadErrMessage . "There was an error inserting the row into the database<br>";
                $isUploadError = true;
            }
        }

        // TODO: What is this doing, also why is it here?
        $conn = null;

        // TODO: What is this doing? Can we clear it all the time? Only if errors? Only if success?
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

    header("Location: " . "/purchase/index.php?purchaseid=$purchaseID");
?>
