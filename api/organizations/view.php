<?php
    // Ensure we're logged in to view.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->select("Organizations", "*");
        if (count($result) == 0) {
            return http_return(400, ["error" => "no results"]);
        }

        return http_return(200, ["result" => $result]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
