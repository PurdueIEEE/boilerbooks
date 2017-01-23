<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    // TODO: Delete all child organizations as well.
    
    // Ensure proper privileges to create a(n) (sub-)organization.
    if(!$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to delete organizations"]);
    }
    
    // Extract the data out of the JSON and break if any fields are missing.
    $name = $_PARAMS["name"];
    if (!isset($name)) {
        return http_return(400, ["error" => "missing fields"]);
    }
    
    // Execute the actual SQL query after confirming its formedness.
    try {
        $result = $database->delete("Organizations", ["name" => $name]);
        if (count($result) == 0) {
            return http_return(400, ["error" => "no such organization"]);
        }
        
        return http_return(200, ["result" => ["name" => $name]]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
?>
