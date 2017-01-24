<?php
    // Extract the data out of the JSON and break if any fields are missing.
    $password = $_PARAMS["password"];
    if (!isset($password)) {
        return Flight::json(["error" => "no password provided"], 400);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = Flight::db()->select("Users", ["username", "password", "revoke_counter"], ["username" => $username]);
        if (count($result) !== 1) {
            return Flight::json(["error" => "user does not exist"], 404);
        }
        if (!password_verify($password, $result[0]["password"])) {
            return Flight::json(["error" => "incorrect password"], 401);
        }

        $issuedAt  = time();
        $notBefore = $issuedAt; // Valid not before the issued time
        $expire    = $notBefore + (60*60*24); // Expires in 1 day

        // Need to switch to Firebase JWT Library that handles these expiration
        $jwt_data = [
            'iat'  => $issuedAt,
            'nbf'  => $notBefore,
            'exp'  => $expire,
            "data" => [
                "username" => $username,
                "root" => ($username === "master" || $username === "mmolo"),
                "ip" => Flight::request()->ip,
                "revoke_counter" => $result[0]['revoke_counter']
            ]
        ];

        $token = JWT::encode(
            $jwt_data,    // Our encoded data
            TOKEN_SECRET, // Our signing key
            'HS512'       // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );

        // Set cookie so that it can be retrieved later
        setcookie(TOKEN_COOKIE, $token, $expire, "/", "purdueieee.org");

        return Flight::json(["result" => $token]);
    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 401);
    }
?>
