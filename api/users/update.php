<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    
    // Extract the data out of the JSON (any of these can be updated, only username is required).
    $username = $_PARAMS["username"];
    if (!isset($username)) {
        return http_return(400, ["error" => "missing username field"]);
    }
    
    // Make sure we have rights to update the user.
    if ($_TOKEN["username"] != $username && !$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to view other users"]);
    }
    
    // Scrub the PARAMS into an updates array. We need to do this so if PARAMS contains
    // any other fields, we don't include those in the SQL query/exec.
    $updates = [];
    $password = $_PARAMS["password"];
    if (isset($password)) {
        $updates["password"] = password_hash($password, PASSWORD_DEFAULT);
    }
    $first = $_PARAMS["first"];
    if (isset($first)) {
        $updates["first"] = $first;
    }
    $last = $_PARAMS["last"];
    if (isset($last)) {
        $updates["last"] = $last;
    }
    $email = $_PARAMS["email"];
    if (isset($email)) {
        $updates["email"] = $email;
    }
    $address = $_PARAMS["address"];
    if (isset($address)) {
        $updates["address"] = $address;
    }
    $city = $_PARAMS["city"];
    if (isset($city)) {
        $updates["city"] = $city;
    }
    $state = $_PARAMS["state"];
    if (isset($state)) {
        $updates["state"] = $state;
    }
    $zip = $_PARAMS["zip"];
    if (isset($zip)) {
        $updates["zip"] = $zip;
    }
    
    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->update("Users", $updates, ["username" => $username]);
        return http_return(200, ["result" => $updates]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
