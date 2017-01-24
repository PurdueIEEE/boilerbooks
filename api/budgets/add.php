<?php
    // Make sure we have rights to update the budget.
    if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to add a budget item"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $organization = $_PARAMS["organization"];
    $name = $_PARAMS["name"];
    $year = $_PARAMS["year"];
    $amount = $_PARAMS["amount"];
    if (!isset($organization) || !isset($name) ||
        !isset($year) || !isset($amount)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->insert("Budgets", [
                          "organization" => $organization,
                          "name" => $name,
                          "year" => $year,
                          "amount" => $amount,
                          ]);
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
