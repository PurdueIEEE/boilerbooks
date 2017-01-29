<?php
    require 'lib/meedo.php';
    require 'lib/php-jwt/JWT.php';
    require 'lib/flight/Flight.php';

    // This file contains server contants. It won't be added to versioning
    require_once '../server_info.php';

    define("API_VERSION", 2);

    // By default use newest API (this) if no version specified, but error on wrong versions
    if (isset(getallheaders()['Version']) && getallheaders()["Version"] !== API_VERSION) {
        return http_return(400, ["error" => "incorrect API version number"]);
    }

    // Connect to the database and execute the command. If there was an error,
    // it is returned as a message; null if no error was expected.
    $database = new database([
        'database_type' => 'mysql',
        'database_name' => DB_NAME,
        'server' => DB_HOST,
        'username' => DB_USER,
        'password' => DB_PASS,
        'charset' => 'utf8',
        'option' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ],
    ]);

    // This function validates that the token is correct
    Flight::map("check_token", function() {

        // Look for token in cookies first
        if (isset(Flight::request()->cookies[TOKEN_COOKIE])) {
            $encoded_token = Flight::request()->cookies[TOKEN_COOKIE];
        }
        // If not in token, check in HTTP Headers, following the Authorization: Bearer schema.
        else if (isset(getallheaders()['Authorization'])
                 && preg_match('/Bearer\s(\S+)/', getallheaders()["Authorization"], $matches)) {
            $encoded_token = $matches[1];
        }

        // Error if we did not find any token
        if (isset($encoded_token) === false) {
            return Flight::json(["error" => "no token supplied"], 401);
        }

        // Attempt to decode token
        try {
            $token = JWT::decode($encoded_token, TOKEN_SECRET, array('HS512'));
        } catch(ExpiredException $e) {
            return Flight::json(["error" => "token has expired"], 401);
        } catch(Exception $e) {
            return Flight::json(["error" => "error decoding token"], 400);
        }

        // Match the IP in the token to the request IP
        if (Flight::request()->ip !== $token->data->ip) {
            return Flight::json(["error" => "ip does not match token"], 400);
        }

        $selector = [
            "AND" => [
                "username" => $token->data->username,
                "revoke_counter" => $token->data->revoke_counter,
            ]
        ];

        if (Flight::db()->has("Users", $selector) === false) {
            return Flight::json(["error" => "user not found"], 404);
        }

        Flight::set('token', $token->data);
    });

    // Map the database to Flight::db()
    Flight::set('database', $database);
    Flight::map("db", function() {
        return Flight::get('database');
    });

    // Map token to Flight::token()
    // TODO: Get rid of this, because the individual api endpoints should not
    // be checking the token for permissions and rights
    Flight::map("token", function() {
        return Flight::get('token');
    });

    // TODO: This needs to be moved later (to Rights, maybe?):
    Flight::route('POST /authenticate/@username', function($username) {
        $_PARAMS = json_decode(Flight::request()->getBody(), true);
        
        // Extract the data out of the JSON and break if any fields are missing.
        $password = $_PARAMS["password"];
        if (!isset($password)) {
            return Flight::json(["error" => "no password provided"], 400);
        }

        // Execute the actual SQL query after confirming its formedness.
        try {
            $result = Flight::db()->select("Users", ["username", "password", "revoke_counter"], ["username" => $username]);
            if (count($result) !== 1) {
                return Flight::json(["error" => "user does not exist"], 404);
            }
            if (!password_verify($password, $result[0]["password"])) {
                return Flight::json(["error" => "incorrect password"], 401);
            }

            // TODO: Need to switch to Firebase JWT Library that handles these expiration
            $issuedAt = time();
            $expiry = $issuedAt + (60*60*24);
            $jwt_data = [
                'iat'  => $issuedAt,
                'nbf'  => $issuedAt,
                'exp'  => $expiry, // 1 day expiry
                "data" => [
                    "username" => $username,
                    "root" => ($username === "master" || $username === "mmolo"),
                    "ip" => Flight::request()->ip,
                    "revoke_counter" => $result[0]['revoke_counter']
                ]
            ];
            
            // Encode a token and return it, but also set it as a cookie.
            $token = JWT::encode($jwt_data, TOKEN_SECRET, 'HS512');
            setcookie(TOKEN_COOKIE, $token, $expiry, "/", "purdueieee.org");
            return Flight::json(["result" => $token]);
        } catch(PDOException $e) {
            return Flight::json(["error" => $e->getMessage()], 401);
        }
    });
    
    // Dynamically invokes a method and maps the associative array of arguments
    // onto the method's parameter names. If any non-optional arguments are
    // missing, the $missing callback is invoked with the parameter name.
    // If the $arguments array contains more arguments than method parameters exist,
    // these leftover arguments will be automatically discarded.
    //
    // Usage:
    // dynamic_invoke("User::add", ["username" => "abc", "invalidparam" => 2], function($name) {
    //     die('Missing parameter $name!');
    // }
    //
    function dynamic_invoke($method, $arguments, callable $missing) {
        $values = [];
        $all = (new \ReflectionMethod($method))->getParameters();
        foreach ($all as $p) {
            $name = $p->getName();
            $exists = array_key_exists($name, $arguments);
            if (!$exists && !$p->isDefaultValueAvailable()) {
                $missing($name);
            }
            $values[$p->getPosition()] = $exists ? $arguments[$name] : $p->getDefaultValue();
        }
        call_user_func_array($method, $values);
    }
    Flight::map('dynamic_invoke', function($method, $arguments, callable $missing) {
        dynamic_invoke($method, $arguments, $missing);
    });
    
    // Dynamically routes an HTTP endpoint to a global or static function,
    // by using the dynamic_invoke() method above and matching parameters.
    function dynamic_route($match, $to, $check_token = true) {
        Flight::route($match, function(...$args) use (&$to, &$check_token) {
            if ($check_token) { Flight::check_token(); }
            $json_params = json_decode(Flight::request()->getBody(), true) ?: [];
            $url_params = array_pop($args)->params; // prioritized in merge()
            Flight::dynamic_invoke($to, array_merge($json_params, $url_params), function($name) {
                return Flight::json(["error" => "missing paramter $name"], 400);
            });
        }, true);
    }
    Flight::map('dynamic_route', function($match, $to, $check_token = true) {
        dynamic_route($match, $to, $check_token);
    });
    
    // Dynamically include all PHP files in the current directory. This will
    // assume that all such PHP files are API endpoints that contain supplement
    // code which registers their applicable routes. It also assumes that they
    // do not inter-include each other (i.e. they must be isolated).
    $this_file = basename($_SERVER['SCRIPT_FILENAME']);
    foreach (glob("*.php") as $filename) {
        if ($filename !== $this_file) {
            include $filename;
        }
    }

    Flight::start();
?>
