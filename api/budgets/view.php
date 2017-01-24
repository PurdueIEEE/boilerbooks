<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    // Extract the data out of the JSON and break if any fields are missing.
    $organization = $_PARAMS["organization"];
    $name = $_PARAMS["name"];
    $year = $_PARAMS["year"];

    // Make sure we have rights to view all items.
    if (!isset($organization) && !isset($name) && !isset($year) && !$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to view all budget items"]);
    }

    // Build the selector so we return the right scope of budget items.
    $selector = [];
    if (isset($organization)) {
        $selector["organization"] = $organization;
    }
    if (isset($name)) {
        $selector["name"] = $name;
    }
    if (isset($year)) {
        $selector["year"] = $year;
    }
    if (count($selector) > 1) {
        $selector = ["AND" => $selector];
    }

    // Make sure we have rights to view the budget items we want.
    if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to view a budget item"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Budgets", "*", $selector);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no matching budget items"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
