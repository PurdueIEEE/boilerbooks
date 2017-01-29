<?php
    
    class Rights {
        protected function __construct() {}
        protected function __clone() {}
        
        // Note: if `orgid = 0 && budget = '*' && amount = 0 && year = 0`, this
        // is considered "root" privilege.
        public static function grant($username, $organization, $budget, $year, $amount) {
            $right = get_defined_vars();
            $right["granter"] = Flight::get('token')->username;
            
            // Ensure proper privileges to grant a root privilege.
            if(($organization == "" && $amount == 0 && $year == 0 && $budget == "*") &&
               !Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to grant root privileges"], 401);
            }
            
            // Ensure proper privileges to grant a right.
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to grant privileges"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                Flight::db()->insert("Rights", $right);
                return Flight::json(["result" => $username]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function revoke($username, $organization, $budget, $year) {
            $right = get_defined_vars();
            
            // Ensure proper privileges to create a(n) (sub-)organization.
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to update an income"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->delete("Rights", ["AND" => $right]);
                
                // Make sure 1 row was acted on, otherwise the income did not exist
                if ($result == 1) {
                    return Flight::json(["result" => $updates]);
                } else {
                    return Flight::json(["error" => "no such right existed"], 404);
                }
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function check($username, $organization, $budget, $year, $amount) {
            
            // Make sure we have rights to view the rights.
            if (!Flight::get('token')) {
                return Flight::json(["error" => "insufficient privileges to check rights"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Rights", "*", ["username" => $username]);
                if (count($result) < 1) {
                    return Flight::json(["error" => "no rights for that user"], 404);
                }
                
                // Check all rights for the user in the given organization & category.
                // Note: amount has to be <= the given amount for the right to be validated.
                // Note: this was intentionally not done as an SQL WHERE clause.
                foreach ($result as $r) {
                    if (($r["organization"] == "" || $r["organization"] == $organization) &&
                        ($r["budget"] == "*" || $r["budget"] == $budget) &&
                        ($r["year"] == 0 || $r["year"] == $year) &&
                        $r["amount"] >= $amount) {
                        return Flight::json(["result" => true]);
                    }
                }
                
                return Flight::json(["result" => false]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function view($username) {
            
            // Make sure we have rights to view the rights.
            if (!Flight::get('token')) {
                return Flight::json(["error" => "insufficient privileges to view rights"], 401);
            }
            
            // Make sure we have rights to view the rights given (or all users).
            if (Flight::get('token')->username != $username && !Flight::get('token')->root) {
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
            if (!Flight::get('token')->root) {
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
