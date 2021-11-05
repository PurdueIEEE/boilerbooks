<?php
    $title = 'Boiler Books';
    // $mypurchasesactive = "active";
    include 'menu.php';
    include 'dbinfo.php';

    $filename = @$_GET['file'];
    $purchase_number_regex = "/.*?_(?P<pnum>[0-9]+)(_reupload_[0-9]+)?\.(png|jpg|pdf)$/";
    preg_match($purchase_number_regex, $filename, $matches);
    if($matches['pnum'] === '') {
        echo "<script type='text/javascript'> document.location = '/404.php; </script>";
		exit;
    }

    if(check_view_permission($matches['pnum'])) {
        // check if file exists
        $file = getcwd() . '/receipts/' . @$_GET['file'];
        if(!is_file($file)) {
            echo "<script type='text/javascript'> document.location = '/404.php; </script>";
            exit;
        }

        // Get MIME Type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file);
        finfo_close($finfo);

        // Send headers
        header('HTTP/1.1 200 OK');
        header("Content-Type: $mime_type");
        header('Content-Length: ' . filesize($file));
        header('Content-Disposition: inline; filename="' .$file. '"');
        header('Content-Transfer-Encoding: binary');
        header('Accept-Ranges: bytes');
        ob_clean();
        flush();

        // Send file data
        readfile($file);
    } else {
        echo "<script type='text/javascript'> document.location = '/purchase/invalid_permission.php; </script>";
        exit;
    }
?>

