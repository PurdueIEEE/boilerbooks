<?php
    // Extract the data out of the JSON and break if any fields are missing.
    $purchaseid = $_PARAMS["purchaseid"];
    $limit = $_PARAMS["limit"]; // <= 250
    $offset = $_PARAMS["offset"];

    $selector = null;
    if (isset($purchaseid)) {
        $selector = ["purchaseid" => $purchaseid];
    } else {

        // Make sure we have rights to view the income.
        if (!$_TOKEN["root"]) {
            return http_return(401, ["error" => "insufficient privileges to view all purchases"]);
        }

        // Make sure if it's a global view that a limit and offset are given.
        if (!isset($limit) || !isset($offset)) {
            return http_return(400, ["error" => "limit and offset missing"]);
        }

        $selector = ["ORDER" => "purchaseid", "LIMIT" => [$offset, $limit]];
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Purchases", "*", $selector);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no purchases"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
