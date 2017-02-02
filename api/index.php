<?php

    require 'lib/meedo.php';
    require 'lib/php-jwt/JWT.php';
    require 'lib/flight/Flight.php';

    // By versioning the API, we ensure that clients are aware of the specific calls
    // and will be explicit in their intent.  By default use newest API (this) if no
    // version is specified, but return an error on older versions that aren't supported.
    define("API_VERSION", 2);
    if (isset(getallheaders()['Version']) && getallheaders()["Version"] !== API_VERSION) {
        return http_return(400, ["error" => "incorrect API version number"]);
    }

    // The `server_info.php` file contains database and token secrets and will not
    // be versioned with the API. Establishing connection to the database occurs first,
    // before any API endpoints are established.
    require_once '../server_info.php';
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
    Flight::map("db", function() {
        return Flight::get('database');
    });
    require_once 'utils.php';

    // Establish API endpoints and start!
    require_once 'rights.php';
    require_once 'authenticate.php';
    require_once 'budget.php';
    require_once 'income.php';
    require_once 'organization.php';
    require_once 'purchase.php';
    require_once 'user.php';
    Flight::start();
?>
