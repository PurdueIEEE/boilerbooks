<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    // Ensure we're logged in to check privileges.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $organization = $_PARAMS["organization"];
    $budget = $_PARAMS["budget"];
    $year = $_PARAMS["year"];
    $amount = $_PARAMS["amount"];
    if (!isset($username) || !isset($organization) || !isset($budget) ||
        !isset($year) || !isset($amount)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Rights", "*", ["username" => $username]);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no results"]);
        }

        // Check all rights for the user in the given organization & category.
        // Note: amount has to be <= the given amount for the right to be validated.
        // Note: this was intentionally not done as an SQL WHERE clause.
        foreach ($result as $r) {
            if (($r["organization"] == "" || $r["organization"] == $organization) &&
                ($r["budget"] == "*" || $r["budget"] == $budget) &&
                ($r["year"] == 0 || $r["year"] == $year) &&
                $r["amount"] >= $amount) {
                return http_return(200, ["result" => true]);
            }
        }

        // If we couldn't return while checking, we have no applicable rights; bail.
        return http_return(200, ["result" => false]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
