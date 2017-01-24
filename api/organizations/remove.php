<?php
    // TODO: Delete all child organizations as well.

    // Ensure proper privileges to create a(n) (sub-)organization.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to delete organizations"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $name = $_PARAMS["name"];
    if (!isset($name)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->delete("Organizations", ["name" => $name]);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no such organization"]);
        }

        return http_return(200, ["result" => ["name" => $name]]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
