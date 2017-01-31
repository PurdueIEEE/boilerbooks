<?php
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
            return Flight::json(["error" => "user not found or token has been revoked"], 404);
        }

        Flight::set('user', $token->data->username);
    });

    Flight::map("db", function() {
        return Flight::get('database');
    });

    // The internal log() function is for any database transactions to be recorded
    // along with a timestamp of when it occurred.
    Flight::map("log", function($log) {
        file_put_contents('./transactions.log', "[".date("Y-m-d h:i:sa")."] ".$log."\n", FILE_APPEND);
    });

    // To support CORS pre-flight requests.
    //header('Access-Control-Allow-Origin: *');
    //header('Access-Control-Allow-Headers: Content-Type, Authorization');
    //Flight::route('OPTIONS *', function() {
        //Flight::json('');
    //});

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
    function dynamic_route($match, $to, $require_auth = true) {
        Flight::route($match, function(...$args) use (&$to, &$require_auth) {
            if ($require_auth) { Flight::check_token(); }
            $json_params = json_decode(Flight::request()->getBody(), true) ?: [];
            $url_params = array_pop($args)->params; // prioritized in merge()
            Flight::dynamic_invoke($to, array_merge($json_params, $url_params), function($name) {
                return Flight::json(["error" => "missing paramter $name"], 400);
            });
        }, true);
    }
    Flight::map('dynamic_route', function($match, $to, $require_auth = true) {
        dynamic_route($match, $to, $require_auth);
    });

    // Sends a JSON response.
    // Code copied from Flight/engine
    // Additions for setting the origin header were added
    Flight::map('json', function($data, $code = 200, $encode = true, $charset = 'utf-8', $option = 0) {
        $json = ($encode) ? json_encode($data, $option) : $data;

        $origin_header = isset(getallheaders()['Origin']) ? getallheaders()['Origin'] : '*';

        Flight::response()
            ->status($code)
            ->header('Content-Type', 'application/json; charset='.$charset)
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Allow-Origin', $origin_header)
            ->write($json)
            ->send();
    });
?>
