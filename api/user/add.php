<?php
    // Extract the data out of the JSON and break if any fields are missing.
    $password = $_PARAMS["password"] ?: "";
    $first = $_PARAMS["first"] ?: "";
    $last = $_PARAMS["last"] ?: "";
    $email = $_PARAMS["email"] ?: "";
    $address = $_PARAMS["address"] ?: "";
    $city = $_PARAMS["city"] ?: "";
    $state = $_PARAMS["state"] ?: "";
    $zip = $_PARAMS["zip"] ?: "";
    $cert = $_PARAMS["cert"] ?: ""; // base64-encoded
    if (!isset($username) || !isset($password) || !isset($first) ||
        !isset($last) || !isset($email) || !isset($address) ||
        !isset($city) || !isset($state) || !isset($zip) || !isset($cert)) {
        return Flight::json(["error" => "missing fields"], 400);
    }

    $user = [
        "username" => $username,
        "password" => password_hash($password, PASSWORD_DEFAULT),
        "first" => $first,
        "last" => $last,
        "email" => $email,
        "address" => $address,
        "city" => $city,
        "state" => $state,
        "zip" => $zip,
        "cert" => $cert,
    ];

    // Execute the actual SQL query after confirming its formedness.
    try {
        Flight::db()->insert("Users", $user);

        return Flight::json(["result" => $user], 201);
    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 500);
    }
?>
