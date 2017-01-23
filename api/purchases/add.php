<?php
    /**
     Copyright (c) 2017 Aditya Vaidyam
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    
    // Ensure proper privileges to create a purchase.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }
    
    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $organization = $_PARAMS["orgid"];
    $category = $_PARAMS["catid"];
    $item = $_PARAMS["item"];
    $reason = $_PARAMS["reason"];
    $vendor = $_PARAMS["vendor"];
    $cost = $_PARAMS["cost"];
    $comments = $_PARAMS["comments"];
    if (!isset($username) || !isset($organization) || !isset($category) ||
        !isset($item) || !isset($reason) || !isset($vendor) || !isset($cost) || !isset($comments)) {
        return http_return(400, ["error" => "missing fields"]);
    }
    
    // Make sure we have rights to update the purchase.
    if ($_TOKEN["username"] != $username && !$_TOKEN["root"]) {
        return http_return(401, ["error" => "insufficient privileges to add other users' purchases"]);
    }
    
    // Execute the actual SQL query after confirming its formedness.
    try {
        $database->insert("Purchases", [
                          "username" => $username,
                          "orgid" => $password,
                          "catid" => $first,
                          "item" => $last,
                          "reason" => $email,
                          "vendor" => $address,
                          "cost" => $city,
                          "comments" => $state,
                          ]);
        //SELECT @@IDENTITY AS PID;
        return http_return(200, ["result" => $_PARAMS]);
    } catch(PDOException $e) {
        return http_return(400, ["error" => $e->getMessage()]);
    }
    
    // Get the info of the people to approve the purchase and return it.
    /*
	SELECT CONCAT(U.first, ' ', U.last) name, U.email, a.committee
	FROM approval a
	INNER JOIN Users U
		ON U.username = a.username
	WHERE a.committee = (
		SELECT P.committee
		FROM Purchases P
		WHERE P.purchaseID = '$currentitemid'
	)
		AND a.ammount >= (
			SELECT P.cost
			FROM Purchases P
			WHERE P.purchaseID = '$currentitemid'
		)
		AND a.category = (
			SELECT P.category
			FROM Purchases P
			WHERE P.purchaseID = '$currentitemid'
		)
		OR a.category = '*'
	);
    */
?>
