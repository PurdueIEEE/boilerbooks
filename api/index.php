<?php
    require 'database.php';
    require 'token.php';
    require 'flight/Flight.php';

    // This file contains server contants. It won't be added to versioning
    require_once '../server_info.php';

    define("API_VERSION", 2);

    // By default use newest API (this) if no version specified, but error on wrong versions
    if (isset(getallheaders()['Version']) && getallheaders()["Version"] !== API_VERSION) {
        return http_return(400, ["error" => "incorrect API version number"]);
    }

    // Connect to the database and execute the command. If there was an error,
    // it is returned as a message; null if no error was expected.
    $database = new database([
        'database_type' => 'mysql',
        'database_name' => DB_NAME,
        'server' => DB_HOST,
        'username' => DB_USER,
        'password' => DB_PASS,
        'charset' => 'utf8',
        'option' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ],
    ]);

    // This function validates that the token is correct
    Flight::map("check_token", function() {
        
        // Look for token in cookies first
        if (isset(Flight::request()->cookies[TOKEN_COOKIE])) {
            $encoded_token = Flight::request()->cookies[TOKEN_COOKIE];
        }
        // If not in token, check in HTTP Headers, following the Authorization: Bearer schema.
        else if (isset(getallheaders()['Authorization'])
                 && preg_match('/Bearer\s(\S+)/', getallheaders()["Authorization"], $matches)) {
            $encoded_token = $matches[1];
        }

        // Error if we did not find any token
        if (isset($encoded_token) === false) {
            return Flight::json(["error" => "no token supplied"], 401);
        }

        // Attempt to decode token
        try {
            $token = JWT::decode($encoded_token, TOKEN_SECRET);
        } catch(Exception $e) {
            return Flight::json(["error" => "error decoding token"], 400);
        }

        // Match the IP in the token to the request IP
        if (Flight::request()->ip !== $token['data']['ip']) {
            return Flight::json(["error" => "ip does not match token"], 400);
        }

        // TODO: Check that user exists in db and the revoke counter is the same
        // TODO: db->has WHERE username = token[username] AND revoke_counter = token[revoke_counter]

        Flight::set('token', $token);
    });

    // Map the database to Flight::db()
    Flight::set('database', $database);
    Flight::map("db", function() {
        return Flight::get('database');
    });

    // Map token to Flight::token()
    // TODO: Get rid of this, because the individual api endpoints should not
    // be checking the token for permissions and rights
    Flight::map("token", function() {
        return Flight::get('token');
    });


    require 'user/index.php';

    Flight::start();
?>
