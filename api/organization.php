<?php
    
    class Organization {
        protected function __construct() {}
        protected function __clone() {}
        
        public static function add($name, $parent = null) {
            $org = get_defined_vars();
            
            // Ensure proper privileges to create a(n) (sub-)organization.
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to create organizations"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                Flight::db()->insert("Organizations", ["name" => $name, "parent" => $parent]);
                return Flight::json(["result" => $org]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function remove($name) {
            
            // Ensure proper privileges to create a(n) (sub-)organization.
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to delete organizations"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->delete("Organizations", ["name" => $name]);
                
                // Make sure 1 row was acted on, otherwise the user did not exist
                if ($result == 1) {
                    return Flight::json(["result" => $name]);
                } else {
                    return Flight::json(["error" => "no such organization"], 404);
                }
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function search() {
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Organizations", "*");
                
                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
    }
    
    Flight::dynamic_route('POST /organization/@name', 'Organization::add');
    Flight::dynamic_route('DELETE /organization/@name', 'Organization::remove');
    Flight::dynamic_route('GET /organizations', 'Organization::search');
?>