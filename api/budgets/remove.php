<?php
    // Ensure proper privileges to remove a budget.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to remove budget items"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $organization = $_PARAMS["organization"];
    $name = $_PARAMS["name"];
    $year = $_PARAMS["year"];
    if (!isset($organization) || !isset($name) || !isset($year)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->delete("Budgets", ["AND" => [
                                    "organization" => $organization,
                                    "name" => $name,
                                    "year" => $year,
                                    ]]);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no such budget item"]);
        }

        return http_return(200, ["result" => ["orgid" => $result]]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
