<?php
    if(!$_TOKEN->root) {
        return Flight::json(["error" => "insufficient privileges to view all users"], 401);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = Flight::db()->select("Users", "*");

        return Flight::json(["result" => $result]);
    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 500);
    }
?>
