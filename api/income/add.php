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

    // Extract the data out of the JSON and break if any fields are missing.
    $organization = $_PARAMS["organization"];
    $year = $_PARAMS["year"];
    $source = $_PARAMS["source"];
    $type = $_PARAMS["type"];
    $amount = $_PARAMS["amount"];
    $item = $_PARAMS["item"];
    $status = $_PARAMS["status"];
    $comments = $_PARAMS["comments"];
    if (!isset($organization) || !isset($year) || !isset($source) || !isset($type) ||
        !isset($amount) || !isset($item) || !isset($status) || !isset($comments)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Make sure we have rights to add an income.
    if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to add an income"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->insert("Income", [
                          "username" => $_TOKEN["username"],
                          "organization" => $organization,
                          "year" => $year,
                          "source" => $source,
                          "type" => $type,
                          "amount" => $amount,
                          "item" => $item,
                          "status" => $status,
                          "comments" => $comments,
                          ]);
        // return budgetid!
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
