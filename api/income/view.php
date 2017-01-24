<?php
    // Extract the data out of the JSON and break if any fields are missing.
    $incomeid = $_PARAMS["incomeid"];
    $selector = null;
    if (isset($incomeid)) {
        $selector = ["incomeid" => $incomeid];
    } else if (!$_TOKEN["root"]) {

        // Make sure we have rights to view the income.
        return http_return(401, ["error" => "insufficient privileges to view an income"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Income", "*", $selector);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no matching incomes"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
