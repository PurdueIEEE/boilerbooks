<?php
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
