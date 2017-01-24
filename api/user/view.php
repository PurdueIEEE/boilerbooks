<?php
    // Make sure we have rights to view the username given (or all users).
    if ($_TOKEN->username != $username && !$_TOKEN->root) {
        return Flight::json(["error" => "insufficient privileges to view other users"], 401);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = Flight::db()->select("Users", "*", ["username" => $username]);
        if (count($result) == 0) {
            return Flight::json(["error" => "no results"], 404);
        }

        return Flight::json(["result" => $result[0]], 200);
    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 500);
    }
?>
