<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    // TODO: If the same right already exists, just update its amount and granter.
    
    // Extract the data out of the JSON and break if any fields are missing.
    // Note: if `orgid = 0 && budget = '*' && amount = 0 && year = 0`, this
    // is considered "root" privilege.
    $username = $_PARAMS["username"];
    $organization = $_PARAMS["organization"];
    $budget = $_PARAMS["budget"];
    $year = $_PARAMS["year"];
    $amount = $_PARAMS["amount"];
    if (!isset($username) || !isset($organization) || !isset($budget) ||
        !isset($year) || !isset($amount)) {
        return http_return(400, ["error" => "missing fields"]);
    }
    
    // Ensure only root privilege holders can grant root privilege to others.
    if(($organization == "" && $amount == 0 && $year == 0 && $budget == "*") && !$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to grant root privilege"]);
    }
    
    // Ensure privilege can only be granted if the granter has that privilege.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to grant privileges"]);
    }
    
    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->insert("Rights", [
            "username" => $username,
            "organization" => $organization,
            "budget" => $budget,
            "year" => $year,
            "amount" => $amount,
            "granter" => $_TOKEN["username"],
        ]);
        return http_return(200, ["result" => $username]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
