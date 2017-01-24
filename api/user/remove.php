<?php
    // Make sure we have rights to delete users.
    if(!$_TOKEN['data']["root"]) {
        return Flight::json(["error" => "insufficient privileges to delete users"], 401);
    }

    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = Flight::db()->delete("Users", ["username" => $username]);

        // Make sure 1 row was acted on, otherwise the user did not exist
        if ($result == 1) {
            return Flight::json(["result" => $user]);
        } else {
            return Flight::json(["error" => "user not found"], 404);
        }

    } catch(PDOException $e) {
        return Flight::json(["error" => $e->getMessage()], 500);
    }
?>
