<?php
    //require_once 'rights.php';
    // FIXME: Need a way to get all authorities higher than the currently authed user.
    
    class Rights {
        protected function __construct() {}
        protected function __clone() {}
        
        // Note: if `organization = '*' && budget = '*' && amount = -1 && year = -1`, this
        // is considered "root" privilege.
        public static function grant($username, $organization, $budget, $year, $amount) {
            $right = get_defined_vars();
            $right["granter"] = Flight::get('token')->username;
            
            // Enforce the proper schema for a root privileged right.
            if($organization === "*" && ($budget !== "*" || $year != -1 || $amount != -1)) {
                return Flight::json(["error" => "improperly formed root privileged right"], 400);
            }
            
            // Ensure proper privilege cascade to grant new rights.
            if(!Rights::check_rights(Flight::get('token')->username, $organization, $budget, $year, $amount)) {
                return Flight::json(["error" => "insufficient privileges to grant privileges"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                Flight::db()->insert("Rights", $right);
                Flight::log(Flight::db()->last_query());
                return Flight::json(["result" => $username]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function revoke($username, $organization, $budget, $year) {
            $right = get_defined_vars();
            
            // Ensure proper privileges to revoke rights.
            // FIXME: Confirm that -1 amount enforces [revoker > revokee].
            if(!Rights::check_rights(Flight::get('token')->username, $organization, $budget, $year, -1)) {
                return Flight::json(["error" => "insufficient privileges to revoke rights"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->delete("Rights", ["AND" => $right]);
                
                // Make sure 1 row was acted on, otherwise the income did not exist
                if ($result === 1) {
                    Flight::log(Flight::db()->last_query());
                    return Flight::json(["result" => $updates]);
                } else {
                    return Flight::json(["error" => "no such right existed"], 404);
                }
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function check_rights($username, $organization, $budget, $year, $amount) {
            
            // Make sure we have rights to view the rights.
            if (!Flight::get('token')) {
                return [["error" => "insufficient privileges to check rights"], 401];
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Rights", "*", ["username" => $username]);
                if (count($result) < 1) {
                    return [["error" => "no rights for that user"], 404];
                }
                
                // Check all rights for the user in the given organization & category.
                // Note: amount has to be <= the given amount for the right to be validated.
                // Note: this was intentionally not done as an SQL WHERE clause.
                foreach ($result as $r) {
                    if (($r["organization"] === "*" || $r["organization"] === $organization) &&
                        ($r["budget"] === "*" || $r["budget"] === $budget) &&
                        ($r["year"] == -1 || $r["year"] == $year) &&
                        ($r["amount"] == -1 || $r["amount"] >= $amount)) {
                        return [["result" => true], 200];
                    }
                }
                
                return [["result" => false], 200];
            } catch(PDOException $e) {
                return [["error" => $e->getMessage()], 500];
            }
        }
        
        // Public-facing version of the _check() function.
        public static function check($username, $organization, $budget, $year, $amount) {
            [$json, $code] = Rights::check_rights();
            return Flight::json($json, $code);
        }
        
        public static function view($username) {
            
            // Make sure we have rights to view the rights given (or all users).
            if (Flight::get('token')->username != $username &&
                !Rights::check_rights(Flight::get('token')->username, "*", "*", -1, -1)) {
                return Flight::json(["error" => "insufficient privileges to view other users' rights"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Rights", "*", ["username" => $username]);
                if (count($result) < 1) {
                    return Flight::json(["error" => "no results"], 404);
                }
                
                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function search() {
            
            // Make sure we have rights to view the rights given (or all users).
            if (!Rights::check_rights(Flight::get('token')->username, "*", "*", -1, -1)) {
                return Flight::json(["error" => "insufficient privileges to view all rights"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Rights", "*");
                if (count($result) < 1) {
                    return Flight::json(["error" => "no results"], 404);
                }
                
                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
    }
    
    // FIXME: check()?
    Flight::dynamic_route('GET /check/@username', 'Rights::check');
    Flight::dynamic_route('GET /rights/@username', 'Rights::view');
    Flight::dynamic_route('POST /rights/@username', 'Rights::grant');
    Flight::dynamic_route('DELETE /rights/@username', 'Rights::revoke');
    Flight::dynamic_route('GET /rights', 'Rights::search');
?>
