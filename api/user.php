<?php
    require_once 'rights.php';

    class User {
        protected function __construct() {}
        protected function __clone() {}

        public static function add($username, $password, $first, $last,
                                   $email, $address, $city, $state, $zip) {

            $user = get_defined_vars();
            $user["password"] = password_hash($password, PASSWORD_DEFAULT);

            // TODO: Check username, password and other field correctness

            // Execute the actual SQL query after confirming its formedness.
            try {
                Flight::db()->insert("Users", $user);
                Flight::log(Flight::db()->last_query());
                return Flight::json(["result" => $user], 201);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function remove($username) {
            // Make sure we have rights to delete users.
            if(Flight::get('user') != $username &&
               !Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to delete users"], 401);
            }

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->delete("Users", ["username" => $username]);

                // Make sure 1 row was acted on, otherwise the user did not exist
                if ($result == 1) {
                    Flight::log(Flight::db()->last_query());
                    return Flight::json(["result" => $username]);
                } else {
                    return Flight::json(["error" => "user not found"], 404);
                }
            } catch(PDOException $e) {
                Flight::log(Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function update($username, $password = null, $first = null, $last = null,
                                      $email = null, $address = null, $city = null, $state = null,
                                      $zip = null) {

            $user = get_defined_vars();

            // Make sure we have rights to update the user.
            if (Flight::get('user') != $username &&
                !Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to update other users"], 401);
            }

            // Scrub the parameters into an updates array.
            $updates = array_filter($user, function($v, $k) { return !is_null($v); }, ARRAY_FILTER_USE_BOTH);
            unset($updates["username"]);
            if (count($updates) == 0) {
                return Flight::json(["error" => "no updates to commit"], 400);
            }

            // If the password is being modified (even to the same thing), you *must* increment the
            // revoke counter to invalidate old tokens dispersed for authentication.
            if (isset($updates["password"])) {
                $user["password"] = password_hash($password, PASSWORD_DEFAULT);
                $updates["revoke_counter[+]"] = "1";
            }

            // Execute the actual SQL query after confirming its formedness.
            try {

                // Make sure the user exists. This needs an extra query, because update will
                // return 0 when no changes are made, but the user still exists
                if (Flight::db()->has("Users", ["username" => $username]) === false) {
                    return Flight::json(["error" => "user not found"], 404);
                }

                Flight::db()->update("Users", $updates, ["username" => $username]);
                Flight::log(Flight::db()->last_query());

                // FIXME: "revoke_counter[+]" should be removed when returning updates.
                return Flight::json(["result" => $updates]);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function view($username) {
            // Make sure we have rights to view the username given (or all users).
            if (Flight::get('user') != $username &&
                !Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to view other users"], 401);
            }

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Users", ["username", "first", "last", "email", "address", "city", "state", "zip"], ["username" => $username]);
                if (count($result) == 0) {
                    return Flight::json(["error" => "no results"], 404);
                }

                return Flight::json(["result" => $result[0]], 200);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function search() {
            if(!Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to view all users"], 401);
            }

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Users", ["username", "first", "last", "email", "address", "city", "state", "zip"]);

                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function uploadCert($username) {

            if (!isset($_FILES['certificate'])) {
                return Flight::json(["error" => "no certificate file sent"], 400);
            }

            // Undefined | Multiple Files | $_FILES Corruption Attack
            // If this request falls under any of them, treat it invalid.
            if (!isset($_FILES['certificate']['error']) || is_array($_FILES['certificate']['error'])) {
                return Flight::json(["error" => "invalid parameters"], 400);
            }

            // Check $_FILES['certificate']['error'] value.
            switch ($_FILES['certificate']['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    return Flight::json(["error" => "no certificate file sent"], 400);
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    return Flight::json(["error" => "exceeded max file size"], 400);
                default:
                    return Flight::json(["error" => "some unknown error occurred"], 500);
            }


            $file_size = $_FILES['certificate']['size'];
            $file_tmp  = $_FILES['certificate']['tmp_name'];
            $file_type = $_FILES['certificate']['type'];
            $file_size = $_FILES['certificate']['size'];
            $file_ext  = strtolower(end(explode('.',$_FILES['certificate']['name'])));

            // Max file size 5 Megabytes
            $MAX_SIZE = 5 * 1024 * 1024;

            if ($file_size > $MAX_SIZE) {
                return Flight::json(["error" => "exceeded max file size"], 400);
            }

            $PDF_MIME = 'application\/pdf';

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $finfo_is_pdf = (finfo_file($finfo, $file_tmp) !== $PDF_MIME);
            finfo_close($finfo);

            if (!$finfo_is_pdf || $file_ext != 'pdf') {
                return Flight::json(["error" => "file is not a pdf"], 400);
            }

            $new_filename = sprintf('%s/certs/%s-%s-%s.pdf',
                UPLOAD_DIR,
                preg_replace("/[^a-z0-9.]+/i", "", $username),
                sha1_file($file_tmp),
                date('Y-m-d-His')
            );

            if (!move_uploaded_file($file_tmp, $new_filename)) {
                return Flight::json(["error" => "error moving file"], 500);
            }

            try {

                $result = Flight::db()->select("Users", ["cert"], ["username" => $username]);
                if (count($result) === 1 && isset($result[0]['cert'])) {
                    $old_file = $result[0]['cert'];
                    if ($old_file !== $new_filename) {
                        try {
                            unlink($old_file);
                        } catch (Exception $e) {}
                    }
                }

                Flight::db()->update("Users", ["cert" => $new_filename], ["username" => $username]);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }

            return Flight::json(['result' => "/user/$username/certificate"]);
        }

        public static function getCert($username) {
            if (Flight::get('user') !== $username) {
                return Flight::json(["error" => "access denied"], 403);
            }

            $result = Flight::db()->select("Users", ["cert"], ["username" => $username]);
            if (count($result) !== 1 || empty($result[0]['cert'])) {
                return Flight::json(["error" => "no cert found"], 404);
            }

            $file = file_get_contents($result[0]['cert']);

            Flight::response()
                ->status(200)
                ->header("Content-Type", "application/pdf")
                ->write($file)
                ->send();
        }
    }

    Flight::dynamic_route('GET /user/@username', 'User::view');
    Flight::dynamic_route('POST /user/@username', 'User::add', $require_auth=false);
    Flight::dynamic_route('PATCH /user/@username', 'User::update');
    Flight::dynamic_route('DELETE /user/@username', 'User::remove');
    Flight::dynamic_route('GET /users', 'User::search');
    Flight::dynamic_route('POST /user/@username/certificate', 'User::uploadCert');
    Flight::dynamic_route('GET /user/@username/certificate', 'User::getCert');
?>
