<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    // Extract the data out of the JSON and break if any fields are missing.
    $password = $_PARAMS["password"];
    if (!isset($password)) {
        return Flight::json(["error" => "no password provided"], 400);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = Flight::db()->select("Users", ["username", "password"], ["username" => $username]);
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
            ]
        ];

        $token = JWT::encode(
            $jwt_data,    // Our encoded data
            TOKEN_SECRET, // Our signing key
            'HS512'       // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );

        // Set cookie so that it can be retrieved later
        setcookie(TOKEN_COOKIE, $token, $expire, "/", "molee.me");

        return Flight::json(["result" => $token]);
    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 401);
    }
?>
