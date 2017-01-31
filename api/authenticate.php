<?php
    require_once 'rights.php';

    class Authenticate {
        protected function __construct() {}
        protected function __clone() {}

        private function issue_token($username, $ip, $revoke_counter) {
            $issuedAt = time();
            $expiry = $issuedAt + (60*60*24*3); // 3 day expiry
            $jwt_data = [
                'iat'  => $issuedAt,
                'nbf'  => $issuedAt,
                'exp'  => $expiry,
                "data" => [
                    "username" => $username,
                    "ip" => Flight::request()->ip,
                    "revoke_counter" => $revoke_counter
                ]
            ];

            // Encode a token and return it, but also set it as a cookie.
            $token = JWT::encode($jwt_data, TOKEN_SECRET, 'HS512');
            setcookie(TOKEN_COOKIE, $token, $expiry, "/", SERVER_HOST);

            return $token;
        }

        public static function login($username, $password) {
            // Execute the actual SQL query after confirming its formedness.
            try {
                $result = Flight::db()->select("Users", ["username", "password", "revoke_counter"], ["username" => $username]);

                if (count($result) !== 1) {
                    return Flight::json(["error" => "user does not exist"], 404);
                }
                if (!password_verify($password, $result[0]["password"])) {
                    return Flight::json(["error" => "incorrect password"], 401);
                }

                $token = Authenticate::issue_token($username, Flight::request()->ip, $result[0]['revoke_counter']);

                return Flight::json(["result" => $token]);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }

        public static function revoke($username) {
            try {
                $result = Flight::db()->update("Users", ["revoke_counter[+]" => 1], ["username" => $username]);

                if (count($result) !== 1) {
                    return Flight::json(["error" => "user does not exist"], 404);
                }

                //Remove the data in the cookie and expire it
                setcookie(TOKEN_COOKIE, "", time()-3600, "/", SERVER_HOST);

                return Flight::json(["result" => 'success']);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }

        }

        public static function check($username) {
            return Flight::json(["result" => true]);
        }

        public static function refresh($username) {
            try {
                $result = Flight::db()->select("Users", ["revoke_counter"], ["username" => $username]);

                if (count($result) !== 1) {
                    return Flight::json(["error" => "user does not exist"], 404);
                }

                $token = Authenticate::issue_token($username, Flight::request()->ip, $result[0]['revoke_counter']);

                return Flight::json(["result" => $token]);
            } catch(PDOException $e) {
                Flight::log("Error: ". $e->getMessage() . " Query: ".Flight::db()->last_query());
                return Flight::json(["error" => "Server error occurred. Please try again."], 500);
            }
        }
    }

    Flight::dynamic_route('POST /authenticate/@username', 'Authenticate::login', $require_auth=false);
    Flight::dynamic_route('DELETE /authenticate/@username', 'Authenticate::revoke');
    Flight::dynamic_route('GET /authenticate/@username', 'Authenticate::check');
    Flight::dynamic_route('GET /authenticate/@username/refresh', 'Authenticate::refresh');
?>
