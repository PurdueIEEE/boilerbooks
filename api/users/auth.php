<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $password = $_PARAMS["password"];
    if (!isset($username)) {
        return http_return(400, ["error" => "no username provided"]);
    }
    if (!isset($password)) {
        return http_return(400, ["error" => "no password provided"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Users", ["username", "password"], ["username" => $username]);
        if (count($result) != 1) {
            return http_return(400, ["error" => "incorrect username"]);
        }
        if (!password_verify($password, $result[0]["password"])) {
            return http_return(400, ["error" => "incorrect password"]);
        }

        return http_return(200, ["result" => JWT::encode([
            "username" => $username,
            "root" => ($username == "master"),
        ], $token_secret)]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
