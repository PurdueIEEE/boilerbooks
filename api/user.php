<?php
    require_once 'rights.php';
    
    class User {
        protected function __construct() {}
        protected function __clone() {}
        
        // cert is base64-encoded
        public static function add($username, $password, $first, $last,
                                   $email, $address, $city, $state, $zip, $cert) {
            $user = get_defined_vars();
            $user["password"] = password_hash($password, PASSWORD_DEFAULT);
            try {
                Flight::db()->insert("Users", $user);
                Flight::log(Flight::db()->last_query());
                return Flight::json(["result" => $user], 201);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function remove($username) {
            // Make sure we have rights to delete users.
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to delete users"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->delete("Users", ["username" => $username]);
                
                // Make sure 1 row was acted on, otherwise the user did not exist
                if ($result == 1) {
                    Flight::log(Flight::db()->last_query());
                    return Flight::json(["result" => $username]);
                } else {
                    return Flight::json(["error" => "user not found"], 404);
                }
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function update($username, $password = null, $first = null, $last = null,
                                      $email = null, $address = null, $city = null, $state = null,
                                      $zip = null) {
            $user = get_defined_vars();
            
            // Make sure we have rights to update the user.
            if (Flight::get('token')->username != $username && !Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to view other users"], 401);
            }
            
            // Scrub the parameters into an updates array.
            $updates = array_filter($user, function($v, $k) { return !is_null($v); }, ARRAY_FILTER_USE_BOTH);
            unset($updates["username"]);
            if (count($updates) == 0) {
                return Flight::json(["error" => "no updates to commit"], 400);
            }
            
            // If the password is being modified (even to the same thing), you *must* increment the
            // revoke counter to invalidate old tokens dispersed for authentication.
            if (isset($updates["password"])) {
                $user["password"] = password_hash($password, PASSWORD_DEFAULT);
                $updates["revoke_counter[+]"] = "1";
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                
                // Make sure the user exists. This needs an extra query, because update will
                // return 0 when no changes are made, but the user still exists
                if (Flight::db()->has("Users", ["username" => $username]) === false) {
                    return Flight::json(["error" => "user not found"], 404);
                }
                
                Flight::db()->update("Users", $updates, ["username" => $username]);
                Flight::log(Flight::db()->last_query());
                
                // FIXME: "revoke_counter[+]" should be removed when returning updates.
                return Flight::json(["result" => $updates]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function view($username) {
            // Make sure we have rights to view the username given (or all users).
            if (Flight::get('token')->username != $username && !Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to view other users"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Users", ["username", "first", "last", "email", "address", "city", "state", "zip", "cert"], ["username" => $username]);
                if (count($result) == 0) {
                    return Flight::json(["error" => "no results"], 404);
                }
                
                return Flight::json(["result" => $result[0]], 200);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
        
        public static function search() {
            if(!Flight::get('token')->root) {
                return Flight::json(["error" => "insufficient privileges to view all users"], 401);
            }
            
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Users", ["username", "first", "last", "email", "address", "city", "state", "zip", "cert"]);
                
                return Flight::json(["result" => $result]);
            } catch(PDOException $e) {
                return Flight::json(["error" => $e->getMessage()], 500);
            }
        }
    }
    
    Flight::dynamic_route('GET /user/@username', 'User::view');
    Flight::dynamic_route('POST /user/@username', 'User::add');
    Flight::dynamic_route('PATCH /user/@username', 'User::update');
    Flight::dynamic_route('DELETE /user/@username', 'User::remove');
    Flight::dynamic_route('GET /users', 'User::search');
?>
