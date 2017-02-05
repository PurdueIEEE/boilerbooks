<?php
    require_once 'rights.php';

    class Purchase {
        protected function __construct() {}
        protected function __clone() {}

        public static function add($username, $organization, $budget, $item, $reason,
                                   $vendor, $cost, $comments) {
            $purchase = dynamic_uninvoke(__METHOD__, func_get_args());

            // Make sure we have rights to update the purchase.
            if (Flight::get('user') != $username &&
                !Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to add other users' purchases"], 401);
            }
            $income["username"] = Flight::get('user');

            // Execute the actual SQL query after confirming its formedness.
            try {
                //SELECT @@IDENTITY AS PID;
                Flight::db()->insert("Purchases", $purchase);
                log::transact(Flight::db()->last_query());
                return Flight::json(["result" => $purchase]);
            } catch(PDOException $e) {
                return Flight::json(["error" => log::err($e, Flight::db()->last_query())], 500);
            }
        }

        // Get the info of the people to approve the purchase and return it.
        /*
        SELECT CONCAT(U.first, ' ', U.last) name, U.email, a.committee
        FROM approval a
        INNER JOIN Users U
            ON U.username = a.username
        WHERE a.committee = (
            SELECT P.committee
            FROM Purchases P
            WHERE P.purchaseID = '$currentitemid'
        )
            AND a.ammount >= (
                SELECT P.cost
                FROM Purchases P
                WHERE P.purchaseID = '$currentitemid'
            )
            AND a.category = (
                SELECT P.category
                FROM Purchases P
                WHERE P.purchaseID = '$currentitemid'
            )
            OR a.category = '*'
        );
        */

        public static function update($purchaseid, $username, $approvedby = null, $item = null,
                                      $reason = null, $vendor = null, $cost = null, $comments = null,
                                      $status = null, $fundsource = null, $purchasedate = null,
                                      $receipt = null) {
            $purchase = dynamic_uninvoke(__METHOD__, func_get_args());

            // Make sure we have rights to update the purchase.
            if (Flight::get('user') != $username &&
                !Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return Flight::json(["error" => "insufficient privileges to edit other users' purchases"], 401);
            }

            // Scrub the parameters into an updates array.
            $updates = array_filter($purchase, function($v, $k) { return !is_null($v); }, ARRAY_FILTER_USE_BOTH);
            unset($updates["purchaseid"]);
            unset($updates["username"]);
            if (count($updates) == 0) {
                return Flight::json(["error" => "no updates to commit"], 400);
            }
            $updates["#modify"] = "NOW()";

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->update("Purchases", $updates, ["AND" =>
                                               ["purchaseid" => $purchaseid, "username" => $username]
                                               ]);

                // Make sure 1 row was acted on, otherwise the income did not exist
                if ($result == 1) {
                    log::transact(Flight::db()->last_query());
                    return Flight::json(["result" => $purchase]);
                } else {
                    return Flight::json(["error" => "no such purchase"], 404);
                }
            } catch(PDOException $e) {
                return Flight::json(["error" => log::err($e, Flight::db()->last_query())], 500);
            }
        }

        public static function view($purchaseid) {

            // Make sure we have rights to view the purchase.
            if (!Flight::get('user')) {
                return http_return(401, ["error" => "insufficient privileges to view a purchase"]);
            }

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Purchases", "*", ["purchaseid" => $purchaseid]);

                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => log::err($e, Flight::db()->last_query())], 500);
            }
        }

        public static function search($offset = 0, $limit = 250) {

            // Make sure we have rights to view the income.
            if (!Rights::check_rights(Flight::get('user'), "*", "*", 0, -1)[0]["result"]) {
                return http_return(401, ["error" => "insufficient privileges to view all purchases"]);
            }

            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Purchases", "*");

                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => log::err($e, Flight::db()->last_query())], 500);
            }
        }
    }

    Flight::dynamic_route('GET /purchase/@purchaseid', 'Purchase::view');
    Flight::dynamic_route('POST /purchase/@purchaseid', 'Purchase::add');
    Flight::dynamic_route('PATCH /purchase/@purchaseid', 'Purchase::update');
    Flight::dynamic_route('GET /purchases', 'Purchase::search');
?>
