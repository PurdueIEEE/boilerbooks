<?php

    // A special exception subclass to be used by API endpoints; when thrown, causes
    // the API vendor (this code) to return the HTTP error code given by $e->getCode()
    // with JSON, where "error" will be set to $e->getMessage().
    class HTTPException extends Exception {}

    // A static container class for logging functions.
    class log {
        protected function __construct() {}
        protected function __clone() {}

        // The internal sys_log() function is for any non-database logs to be recorded
        // along with a timestamp of when it occurred. Should be used sparingly.
        public static function sys($log) {
            file_put_contents('./sys.log', "[{${date("Y-m-d h:i:sa")}}] $log\n", FILE_APPEND);
        }

        // The internal error_log() function is for any database errors to be recorded
        // along with a timestamp of when it occurred. It should return a UUID of the
        // error, which will then be sent to the administrator and the user as a ticket.
        //
        // Note: if you pass a PDOException, it will automatically log the message and SQL.
        public static function err($exc, $log) {
            if ($log instanceof Exception) {
                $log = $log->getMessage();
            }

            $uuid = uniqid('sql_');
            file_put_contents('./errors.log', "[{${date("Y-m-d h:i:sa")}}] [$uuid] $exc => $log\n", FILE_APPEND);
            return $uuid;
        }

        // The internal transact_log() function is for any database transactions to be recorded
        // along with a timestamp of when it occurred.
        public static function transact() {
            file_put_contents('./transactions.log', "[{${date("Y-m-d h:i:sa")}}] $log\n", FILE_APPEND);
        }
    }

    // Modified version of Flight::json(...) from Flight\Engine to allow setting
    // CORS headers for client consumption. Use this function ALWAYS!
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

    // Validate the token before invoking any API endpoints if it's requested.
    // This is secretly a function of Authenticate::check_token() but it needs to be here.
    function _check_token() {

        // Look for token in cookies first; if not in cookies, check in HTTP
        // headers, following the `Authorization: Bearer <token>` schema.
        // If we can't find a token, we error out.
        if (isset(Flight::request()->cookies[TOKEN_COOKIE])) {
            $encoded_token = Flight::request()->cookies[TOKEN_COOKIE];
        } else if (isset(getallheaders()['Authorization'])
                 && preg_match('/Bearer\s(\S+)/', getallheaders()["Authorization"], $matches)) {
            $encoded_token = $matches[1];
        }
        if (isset($encoded_token) === false) {
            throw new HTTPException("no token supplied", 401);
        }

        // Decode the token and ensure it hasn't expired or that the IP address
        // it was issued to is the one sending it right now. If these security
        // checks fail, error out.
        try {
            $token = JWT::decode($encoded_token, TOKEN_SECRET, ['HS512']);
        } catch(ExpiredException $e) {
            throw new HTTPException("token has expired", 401);
        } catch(Exception $e) {
            throw new HTTPException("error decoding token", 400);
        }
        if (Flight::request()->ip !== $token->data->ip) {
            throw new HTTPException("ip does not match token", 400);
        }

        // Obtain the user and verify the revoke_counter to match the token's.
        // If the revoke_counter is not exactly equal, the token is revoked.
        try {
            $user = Flight::db()->get("Users", ["username", "revoke_counter"],
                                    ["username" => $token->data->username]);
            if (!isset($user)) {
                throw new HTTPException("user not found", 404);
            }
            if ($user['revoke_counter'] > $token->data->revoke_counter) {
                throw new HTTPException("token has been revoked", 404);
            } else if ($user['revoke_counter'] < $token->data->revoke_counter) {
                throw new HTTPException("token is from the future", 404);
            }
        } catch(PDOException $e) {
            throw new HTTPException(log::err($e, Flight::db()->last_query()), 500);
        }

        // Phew, we made it this far, we've passed the gates of Hell!
        return $token;
    }
    Flight::map("check_token", function() {
        Flight::set('user', _check_token()->data->username);
    });

    // TODO: Defines a set of validation functions for API input.
    $_FILTERS = [
        'date' => function($x) {
            return (preg_match("/^[0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2}\$/", $x) == true);
        }, 'amount' => function($x) {
            return (preg_match("/^[-]?[0-9]+\$/", $x) == true);
        }, 'number' => function($x) {
            return (preg_match("/^[-]?[0-9,]+\$/", $x) == true);
        }, 'alfanum' => function($x) {
            return (preg_match("/^[0-9a-zA-Z ,.-_\\s\?\!]+\$/", $x) == true);
        }, 'not_empty' => function($x) {
            return (preg_match("/[a-z0-9A-Z]+/", $x) == true);
        }, 'words' => function($x) {
            return (preg_match("/^[A-Za-z]+[A-Za-z \\s]*\$/", $x) == true);
        }, 'phone' => function($x) {
            return (preg_match("/^[0-9]{10,11}\$/", $x) == true);
        }, 'zipcode' => function($x) {
            return (preg_match("/^[1-9][0-9]{3}[a-zA-Z]{2}\$/", $x) == true);
        }, 'plate' => function($x) {
            return (preg_match("/^([0-9a-zA-Z]{2}[-]){2}[0-9a-zA-Z]{2}\$/", $x) == true);
        }, 'price' => function($x) {
            return (preg_match("/^[0-9.,]*(([.,][-])|([.,][0-9]{2}))?\$/", $x) == true);
        }, '2digitopt' => function($x) {
            return (preg_match("/^\d+(\,\d{2})?\$/", $x) == true);
        }, '2digitforce' => function($x) {
            return (preg_match("/^\d+\,\d\d\$/", $x) == true);
        }, 'anything' => function($x) {
            return (preg_match("/^[\d\D]{1,}\$/", $x) == true);
        } //'is_array' => is_array,
    ];
    Flight::set('FILTERS', $_FILTERS);

    // Extracts all `@filter $name comment` strings from docstrings.
    // TODO: Support ReflectionFunction as well.
    function get_filters($method_name) {
        $str = (new \ReflectionMethod($method_name))->getDocComment();
        if (preg_match_all('/(@filter \$)(\w+)\s+(.*)\r?\n/m', $str, $matches)) {
            return array_combine($matches[2], $matches[3]);
        }
        return [];
    }

    // Extract filters (defined in get_filters()) from the docstrings of functions
    // and map them to the above declared set of filters ($_FILTERS) and ensure
    // the arguments passed to each parameter satisfy their filters.
    //
    // 1. Get all declared function filters, filter to those that exist.
    // 2. Get all arguments whose parameter requires filtering.
    // 3. Fail if any one of the filters fails; if all succeed, return true.
    //
    // Note: if there are more filters on the method than arguments passed, they
    // will NOT be accounted for!! Missing parameters should be checked beforehand.
    function dynamic_filter($method, $arguments, callable $failed) {
        // ["param1" => func1, "param2" => func2]
        $from_filter = array_filter(get_filters($method), function($v) {
            return array_key_exists($v, Flight::get('FILTERS'));
        });
        //throw new HTTPException(["from" => get_filters($method), "to" => $from_filter], 400);
        foreach ($from_filter as $param => $filter_name) {
            $filter_func = Flight::get('FILTERS')[$filter_name];
            if (!(array_key_exists($param, $from_filter) && $filter_func($arguments[$param]))) {
                $failed($param);
                return false;
            }
        }
        return true;
    }

    // Dynamically invokes a method and maps the associative array of arguments
    // onto the method's parameter names. If any non-optional arguments are
    // missing, the $missing callback is invoked with the parameter name.
    // If the $arguments array contains more arguments than method parameters exist,
    // these leftover arguments will be automatically discarded.
    //
    // Usage:
    // $p = ["username" => "abc", "nonexistentparam" => 2];
    // dynamic_invoke("User::add", $p, function($name) {
    //     die('Missing or invalid parameter $name!');
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
                $arguments[$name] = null;
            }
            $values[$p->getPosition()] = $exists ? $arguments[$name] : $p->getDefaultValue();
        }
        return call_user_func_array($method, $values);
    }

    // Unpacks a function's arguments from their positions into an associative
    // array; the inverse of dynamically invoking a function. This MUST be used
    // with the current method name and arguments passed in. If it is not used
    // in this exact way, or a method's argument does not exist, it will fail.
    //
    // Usage:
    // $res = dynamic_uninvoke(__METHOD__, func_get_args());
    function dynamic_uninvoke($method, $arguments) {
        $values = [];
        $all = (new \ReflectionMethod($method))->getParameters();
        foreach ($all as $p) {
            $values[$p->getName()] = $arguments[$p->getPosition()];
        }
        return $values;
    }

    // Dynamically routes an HTTP endpoint to a global or static function,
    // by using the dynamic_invoke() method above and matching parameters.
    function dynamic_route($match, $to, $require_auth = true) {
        Flight::route($match, function(...$args) use (&$to, &$require_auth) {
            if ($require_auth) Flight::check_token();
            $json_params = json_decode(Flight::request()->getBody(), true) ?: [];
            $url_params = array_pop($args)->params; // prioritized in merge()
            $all_params = array_merge($json_params, $url_params);

            // First filter the parameters of the function, then invoke the function.
            try {
                $valid = dynamic_filter($to, $all_params, function($name) {
                    throw new HTTPException("invalid type of parameter $name", 400);
                });
                $res = dynamic_invoke($to, $all_params, function($name) {
                    throw new HTTPException("missing paramter $name", 400);
                });

                // Now we either return result or error if an HTTPException was thrown.
                return Flight::json(["result" => $res]);
            } catch (HTTPException $e) {
                return Flight::json(["error" => $e->getMessage()], $e->getCode());
            }
        }, true);
    }
    Flight::map('dynamic_route', function($match, $to, $require_auth = true) {
        dynamic_route($match, $to, $require_auth);
    });
?>
