<?php
    // TODO: Get rid of $_TOKEN, because the individual api endpoints should not
    // be checking the token for permissions and rights

    Flight::route('GET /user/@username', function($username) {
        Flight::check_token();
        $_TOKEN = Flight::get('token');
        $_PARAMS = Flight::request()->data;

        require 'view.php';
    });

    Flight::route('POST /user/@username', function($username) {
        Flight::check_token();
        $_TOKEN = Flight::get('token');
        $_PARAMS = Flight::request()->data;

        require 'add.php';
    });

    Flight::route('PATCH /user/@username', function($username) {
        Flight::check_token();
        $_TOKEN = Flight::get('token');
        $_PARAMS = Flight::request()->data;

        require 'update.php';
    });

    Flight::route('DELETE /user/@username', function($username) {
        Flight::check_token();
        $_TOKEN = Flight::get('token');
        $_PARAMS = Flight::request()->data;

        require 'remove.php';
    });

    Flight::route('GET /users', function() {
        Flight::check_token();
        $_TOKEN = Flight::get('token');
        $_PARAMS = Flight::request()->data;

        require 'users.php';
    });

    Flight::route('POST /user/@username/authenticate', function($username) {
        $_PARAMS = Flight::request()->data;
        
        require 'auth.php';
    });
?>
