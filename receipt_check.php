<?php
    $title = 'Boiler Books';

    session_start();
    if (!isset($_SESSION['user'])) {
        $headerinfo = "Location: /index.php?returnto=" . $_SERVER['REQUEST_URI'];
        header($headerinfo);
        die();
    }

    // include 'dbinfo.php';
    require_once("purchase/check_permission.php");

    $filename = @$_GET['file'];
    $purchase_number_regex = "/.*?_(?P<pnum>[0-9]+)(_reupload_[0-9]+)?\.(png|jpg|pdf)$/i";
    preg_match($purchase_number_regex, $filename, $matches);
    // error_log(json_encode($matches));
    if(!array_key_exists('pnum', $matches) ||  $matches['pnum'] === '') {
        header("Location: /404.php");
        exit;
    }

    if(check_view_permission($matches['pnum'])) {
        // check if file exists
        $file = getcwd() . '/receipts/' . @$_GET['file'];
        if(!is_file($file)) {
            header("Location: /404.php");
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
        header("Location: /purchase/invalid_permission.php");
        exit;
    }
?>

