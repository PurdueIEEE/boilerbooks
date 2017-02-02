<?php

class Resource {

    public static function upload($filename) {
        if (!isset($_FILES['resource'])) {
            return Flight::json(["error" => "no resource present"], 400);
        }

        // Undefined | Multiple Files | $_FILES Corruption Attack
        // If this request falls under any of them, treat it invalid.
        // Check $_FILES['resource']['error'] value.
        if (!isset($_FILES['resource']['error']) || is_array($_FILES['resource']['error'])) {
            return Flight::json(["error" => "invalid parameters"], 400);
        }
        switch ($_FILES['resource']['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                return Flight::json(["error" => "no resource present"], 400);
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return Flight::json(["error" => "resource exceeded max file size"], 400);
            default:
                return Flight::json(["error" => "unknown resource error occurred"], 500);
        }

        [ // Extract the relevant variables from $_FILES.
            'size' => $file_size,
            'tmp_name' => $file_tmp,
            'type' => $file_type,
            'name' => $file_name
        ] = $_FILES['resource'];
        $file_ext = strtolower(end(explode('.', $file_name)));

        // Prevent uploads larger than 5MB.
        $MAX_SIZE = 5 * 1024 * 1024;
        if ($file_size > $MAX_SIZE) {
            return Flight::json(["error" => "exceeded max file size"], 400);
        }

        // Extract the MIME type of the file.
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $fmime = finfo_file($finfo, $file_tmp);
        finfo_close($finfo);

        // Prevent uploads that are not PDF files.
        // FIXME: Prevent just checking the file extension...
        $TYPES = ['application\/pdf', 'application\/jpeg', 'application\/png'];
        if (in_array($fmime, $TYPES)) {
            return Flight::json(["error" => "resource is not PDF"], 400);
        }

        // Set the new file name and location and move the file over.
        $new_filename = sprintf('%s/resource/%s-%s-%s.pdf',
            UPLOAD_DIR,
            preg_replace("/[^a-z0-9.]+/i", "", Flight::get('user')),
            sha1_file($file_tmp),
            date('Y-m-d-His')
        );
        if (!move_uploaded_file($file_tmp, $new_filename)) {
            return Flight::json(["error" => "error moving resource"], 500);
        }

        // Return the new resource name.
        return Flight::json(['result' => str_replace(UPLOAD_DIR.'/resource/', '', $new_filename)]);
    }

    public static function download($filename) {
        $file = UPLOAD_DIR . '/resource/' . $filename;

        // Extract the MIME type of the file.
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $fmime = finfo_file($finfo, $file);
        finfo_close($finfo);

        // Return the resource as a blob.
        $file_contents = file_get_contents($file);
        Flight::response()
            ->status(200)
            ->header("Content-Type", $fmime)
            ->write($file_contents)
            ->send();
    }

    public static function exists($filename) {
        return file_exists(UPLOAD_DIR . '/resource/' . $filename);
    }

    public static function delete($filename) {
        try {
            unlink(UPLOAD_DIR . '/resource/' . $filename);
        } catch (Exception $e) {}
    }
}

Flight::dynamic_route('POST /resource/@username', 'Resource::upload');
Flight::dynamic_route('GET /resource/@username', 'Resource::download');

?>
