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
    $purchaseid = $_PARAMS["purchaseid"];
    $username = $_PARAMS["username"]; // legacy, must be included
    if (!isset($purchaseid) || !isset($username)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Make sure we have rights to update the purchase.
    if ($_TOKEN["username"] != $username && !$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to edit other users' purchases"]);
    }

    // Scrub the PARAMS into an updates array. We need to do this so if PARAMS contains
    // any other fields, we don't include those in the SQL query/exec.
    $updates = ["#modify" => "NOW()"];
    $approvedby = $_PARAMS["approvedby"];
    if (isset($approvedby)) {
        $updates["first"] = $approvedby;
    }
    $item = $_PARAMS["item"];
    if (isset($item)) {
        $updates["item"] = $item;
    }
    $reason = $_PARAMS["reason"];
    if (isset($reason)) {
        $updates["reason"] = $reason;
    }
    $vendor = $_PARAMS["vendor"];
    if (isset($vendor)) {
        $updates["vendor"] = $vendor;
    }
    $cost = $_PARAMS["cost"];
    if (isset($cost)) {
        $updates["cost"] = $cost;
    }
    $comments = $_PARAMS["comments"];
    if (isset($comments)) {
        $updates["comments"] = $comments;
    }
    $stat = $_PARAMS["status"];
    if (isset($stat)) {
        $updates["status"] = $stat;
    }
    $fundsource = $_PARAMS["fundsource"];
    if (isset($fundsource)) {
        $updates["fundsource"] = $fundsource;
    }
    $purchasedate = $_PARAMS["purchasedate"];
    if (isset($purchasedate)) {
        $updates["purchasedate"] = $purchasedate;
    }
    $receipt = $_PARAMS["receipt"];
    if (isset($receipt)) {
        $updates["receipt"] = $receipt;
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->update("Purchases", $updates, ["AND" => [
                          "purchaseid" => $purchaseid,
                          "username" => $username
                          ]]);
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
