<?php
    require 'lib/meedo.php';
    require 'lib/php-jwt/JWT.php';
    require 'lib/flight/Flight.php';

    // This file contains server contants. It won't be added to versioning
    require_once '../server_info.php';


    // Define this to be API V2
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
    Flight::set('database', $database);

    require_once 'flight_util.php';

    // API Routes
    require_once 'authenticate.php';
    require_once 'budget.php';
    require_once 'income.php';
    require_once 'organization.php';
    require_once 'purchase.php';
    require_once 'rights.php';
    require_once 'user.php';

    Flight::start();
?>
