<?php
    /*
     * Copyright (c) 2017 Aditya Vaidyam
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    // Ensure we're logged in to check privileges.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $selector = null;
    if (isset($username)) {
        $selector = ["username" => $username];

        // Make sure we have rights to view the rights given (or all users).
        if ($_TOKEN["username"] != $username && !$_TOKEN["root"]) {
            return http_return(401, ["error" => "insufficient privileges to view other users' rights"]);
        }
    } else if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to view all rights"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Rights", "*", $selector);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no results"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
