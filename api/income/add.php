<?php
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
