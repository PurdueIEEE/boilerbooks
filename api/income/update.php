<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    
    // Extract the data out of the JSON and break if any fields are missing.
    $incomeid = $_PARAMS["incomeid"];
    if (!isset($incomeid)) {
        return http_return(400, ["error" => "missing fields"]);
    }
    // Scrub the PARAMS into an updates array. We need to do this so if PARAMS contains
    // any other fields, we don't include those in the SQL query/exec.
    $updates = [];
    $year = $_PARAMS["year"];
    if (isset($year)) {
        $updates["year"] = $year;
    }
    $source = $_PARAMS["source"];
    if (isset($source)) {
        $updates["source"] = $source;
    }
    $type = $_PARAMS["type"];
    if (isset($type)) {
        $updates["type"] = $type;
    }
    $amount = $_PARAMS["amount"];
    if (isset($amount)) {
        $updates["amount"] = $amount;
    }
    $item = $_PARAMS["item"];
    if (isset($item)) {
        $updates["item"] = $item;
    }
    $status = $_PARAMS["status"];
    if (isset($status)) {
        $updates["status"] = $status;
    }
    $comments = $_PARAMS["comments"];
    if (isset($comments)) {
        $updates["comments"] = $comments;
    }
    
    // Make sure we have rights to update the income.
    if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to update an income"]);
    }
    
    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->update("Income", $updates, ["incomeid" => $incomeid]);
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
