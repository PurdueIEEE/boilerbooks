<?php
    /*
     * This file have common functions and variables that other files may find useful
     *  and can gain by including dbinfo.php
     */

if(!function_exists("test_input")) {
    function test_input($data) {
        $data = str_replace('/','-',$data);
        $data = str_replace('&','-',$data);
        $data = str_replace('"','',$data);
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
        return $data;
    }
}

if(!function_exists("test_input2")) {
    function test_input2($data) { //used when / needs to be used
        //$data = str_replace('/','-',$data);
        $data = str_replace('&','-',$data);
        $data = str_replace('"','',$data);
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, $flags=ENT_QUOTES| ENT_HTML401);
        return $data;
    }
}

if(!function_exists("console_log")) {
    function console_log($output) {
        $js_code = '<script> console.log(' . json_encode($output, JSON_HEX_TAG) . ');</script>';
        echo $js_code;
    }
}

if(!class_exists("AccessLevel")) {
    // Access Level for the approval table privilege_level
    abstract class AccessLevel
    {
        // Going by 2 so that values can be added in between without needing to change the database.
        const MEMBER = 0;
        const INTERNAL_LEADER = 2;
        const OFFICER = 4;
        const TREASURER = 6;
    };
}

?>
