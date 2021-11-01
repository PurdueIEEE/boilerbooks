<?php
    $title = 'Boiler Books';
    // $mypurchasesactive = "active";
    // include 'menu.php';
    include 'dbinfo.php';



    // check if file exists
    $file = getcwd() . '/receipts/' . @$_GET['file'];
    if(!is_file($file)) {
        exit("404. $file");
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
?>

