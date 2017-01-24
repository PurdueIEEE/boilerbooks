<?php
    // Ensure proper privileges to create a purchase.
    if($_TOKEN == null) {
        return http_return(401, ["error" => "insufficient privileges"]);
    }

    // Extract the data out of the JSON and break if any fields are missing.
    $username = $_PARAMS["username"];
    $organization = $_PARAMS["organization"];
    $budget = $_PARAMS["budget"];
    $item = $_PARAMS["item"];
    $reason = $_PARAMS["reason"];
    $vendor = $_PARAMS["vendor"];
    $cost = $_PARAMS["cost"];
    $comments = $_PARAMS["comments"];
    if (!isset($username) || !isset($organization) || !isset($budget) ||
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
                          "organization" => $organization,
                          "budget" => $budget,
                          "item" => $item,
                          "reason" => $reason,
                          "vendor" => $vendor,
                          "cost" => $cost,
                          "comments" => $comments,
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
