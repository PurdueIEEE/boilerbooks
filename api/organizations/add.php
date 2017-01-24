<?php
    // Ensure proper privileges to create a(n) (sub-)organization.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to create organizations"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $name = $_PARAMS["name"];
    $parentid = $_PARAMS["parent"];
    if (!isset($name)) {
        return http_return(400, ["error" => "missing fields"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->insert("Organizations", ["name" => $name, "parent" => $parentid]);
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
