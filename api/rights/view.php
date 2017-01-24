<?php
    // Ensure we're logged in to check privileges.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $selector = null;
    if (isset($username)) {
        $selector = ["username" => $username];

        // Make sure we have rights to view the rights given (or all users).
        if ($_TOKEN["username"] != $username && !$_TOKEN["root"]) {
            return http_return(401, ["error" => "insufficient privileges to view other users' rights"]);
        }
    } else if (!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to view all rights"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Rights", "*", $selector);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no results"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
