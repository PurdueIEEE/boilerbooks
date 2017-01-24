<?php
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
