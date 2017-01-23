<?php
    require 'database.php';
    require 'token.php';
    
    // This file contains $token_secret. It won't be added to versioning.
    require_once '../dbinfo.php';
    
    // Force clients to match major version otherwise bail.
    if (getallheaders()["Version"] != 2) {
        return http_return(400, ["error" => "incorrect API version number"]);
    }
    
    // Connect to the database and execute the command. If there was an error,
    // it is returned as a message; null if no error was expected.
    $database = new database([
        'database_type' => 'mysql',
        'database_name' => 'ieee-money',
        'server' => 'localhost',
        'username' => 'testuser',
        'password' => $token_secret,
        'charset' => 'utf8',
        'option' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ],
    ]);
    
    // Shorthand function to set an HTTP result and return a JSON value.
    function http_return($code, $value) {
        http_response_code($code);
        echo json_encode($value)."\n";
        return null;
    }
    
    // If the request was authenticated, decode the token.
    // Note: this follows the Authorization: Bearer schema.
    $_TOKEN = [];
    if (preg_match('/Bearer\s(\S+)/', getallheaders()["Authorization"], $matches)) {
        try {
            $_TOKEN = JWT::decode($matches[1], $token_secret);
        } catch(Exception $e) {}
    }
    
    // Dynamically include the PHP file for the method given if it exists.
    $_METHOD = getallheaders()["Method"];
    if (!file_exists($_METHOD.'.php')) {
        return http_return(400, ["error" => 'invalid method: '.$_METHOD]);
    }
    
    // Read the POST data for JSON if it exists.
    $_PARAMS = json_decode(file_get_contents('php://input'), true);
    return include './'.$_METHOD.'.php';
?>
