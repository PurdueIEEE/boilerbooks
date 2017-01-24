<?php
    // Ensure we're root to revoke privileges.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $organization = $_PARAMS["organization"];
    $budget = $_PARAMS["budget"];
    $year = $_PARAMS["year"];
    if (!isset($username) || !isset($organization) || !isset($budget) || !isset($year)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->delete("Rights", [
                                    "AND" => [
                                    "username" => $username,
                                    "organization" => $organization,
                                    "budget" => $budget,
                                    "year" => $year,
                                    ]
                                    ]);
        if ($result == 0) {
            return http_return(400, ["error" => "no such right existed"]);
        }

        return http_return(200, ["result" => $username]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
