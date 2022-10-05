/*
   Copyright 2022 Purdue IEEE and Hadi Ahmed

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { db_conn } from "./index.js";
import { ACCESS_LEVEL, max_fiscal_year_count } from "../common_items.js";

async function getFullPurchaseByID(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%m-%d-%Y') as date, DATE_FORMAT(p.modifydate, '%Y-%m-%dT%H:%i:%sZ') as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
        p.cost, p.comments, p.fundsource, p.username, p.purchaseid, p.check_type,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby,
        (SELECT fiscal_year FROM fiscal_year WHERE fyid = p.fiscal_year) fiscal_year
        FROM Purchases p
        WHERE p.purchaseID = ?`,
        [id]
    );
}

async function createNewPurchase(purchase) {
    return db_conn.promise().execute(
        "INSERT INTO Purchases (fiscal_year,username,item,purchasereason,vendor,committee,category,cost,status,comments,check_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Requested', ?, ?)",
        [max_fiscal_year_count, purchase.user, purchase.item, purchase.reason, purchase.vendor, purchase.committee, purchase.category, purchase.price, purchase.comments, purchase.checkType]
    );
}

async function updatePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), cost=?, vendor=?, purchasereason=?, comments=?, category=?, check_type=?
        WHERE Purchases.purchaseID=? AND Purchases.status NOT IN ('Denied', 'Expired')`,
        [purchase.cost, purchase.vendor, purchase.reason, purchase.comments, purchase.category, purchase.check_type, purchase.purchaseID]
    );
}

async function updateReceipt(id, receipt) {
    return db_conn.promise().execute(
        "Update Purchases SET modifydate = NOW(), receipt=? WHERE Purchases.purchaseID=?",
        [receipt, id]
    );
}

async function getLastInsertedID() {
    return db_conn.promise().execute(
        "SELECT LAST_INSERT_ID()",
        []
    );
}

async function getPurchaseApprovers(purchase) {
    return db_conn.promise().execute(
        `SELECT CONCAT(U.first, ' ', U.last) name, U.email, a.committee FROM approval a
        INNER JOIN Users U ON U.username = a.username
        WHERE a.committee = (
            SELECT P.committee FROM Purchases P WHERE P.purchaseID = ?)
        AND a.amount >= (
            SELECT P.cost FROM Purchases P WHERE P.purchaseID = ?)
        AND (a.category = (
            SELECT P.category FROM Purchases P WHERE P.purchaseID = ?)
            OR a.category = '*')`,
        [purchase, purchase, purchase]
    );
}

async function getAllReimbursements() {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, DATE_FORMAT(p.modifydate, '%Y-%m-%dT%H:%i:%sZ') as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
        p.cost, p.comments, p.fundsource, p.fiscal_year, p.username, p.purchaseid,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
        FROM Purchases p
        WHERE p.status IN ('Processing Reimbursement', 'Reimbursed')`
    );
}

async function approvePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), approvedby=?, item=?, purchasereason=?, vendor=?,
        cost=?, status=?, fundsource=?, comments=?, category=?
        WHERE Purchases.purchaseID = ? AND
        Purchases.status='Requested'`,
        [purchase.approver, purchase.item, purchase.reason, purchase.vendor, purchase.price, purchase.status, purchase.fundsource, purchase.comments, purchase.category, purchase.id]
    );
}

async function cancelPurchase(id) {
    return db_conn.promise().execute(
        `Update Purchases SET modifydate = NOW(), status=?
        WHERE (Purchases.purchaseID = ?) AND
        (Purchases.status IN ('Requested','Approved','Purchased'))`,
        ["Denied", id]
    );
}

async function completePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), purchasedate=?, cost=?, status=?, comments=?,
        receipt=? WHERE Purchases.purchaseID = ?`,
        [purchase.purchasedate, purchase.price, "Purchased", purchase.comments, purchase.receipt, purchase.id]
    );
}

async function reimbursePurchases(id, status) {
    // I tried to make this use WHERE ... IN () to update multiple IDs but
    //  MySQL was throwing errors
    return db_conn.promise().execute(
        "UPDATE Purchases SET modifydate = NOW(), status=? WHERE Purchases.purchaseID=? AND Purchases.status IN ('Purchased','Processing Reimbursement')",
        [status, id]
    );
}

async function getPurchaseByUser(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, p.purchaseid, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
		p.cost, p.comments, p.username purchasedby, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
		FROM Purchases p WHERE p.username = ?
		ORDER BY p.purchaseID DESC`,
        [id]
    );
}

async function getApprovalsForUser(id) {
    return db_conn.promise().execute(
        `SELECT DISTINCT p.purchaseID, p.item FROM Purchases p
        INNER JOIN approval a on p.committee = a.committee
        WHERE p.status = 'Requested'
        AND a.username = ?
        AND (a.category = p.category OR a.category = '*')
        AND p.cost <= (SELECT MAX(ap.amount) FROM approval ap
        WHERE ap.username = ?
        AND ap.committee = p.committee)`,
        [id, id]
    );
}

async function getCompletionsForUser(id) {
    return db_conn.promise().execute(
        `SELECT DISTINCT p.purchaseID, p.item FROM Purchases p
        INNER JOIN approval a on p.committee = a.committee
        WHERE p.status = 'Approved'
        AND p.username = ?`,
        [id]
    );
}

async function getTreasurer(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, p.item, p.purchaseID, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status, p.cost, p.comments, p.username, p.fundsource,
		(SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
		(SELECT CONCAT(U2.first, ' ', U2.last) FROM Users U2 WHERE U2.username = p.approvedby) approvedby
		FROM Purchases p
		WHERE p.status in ('Purchased','Processing Reimbursement')
		AND ? in (
		SELECT U3.username FROM Users U3
		INNER JOIN approval A ON U3.username = A.username
		WHERE (A.privilege_level >= ?))
		ORDER BY p.purchasedate DESC`,
        [id, ACCESS_LEVEL.treasurer]
    );
}

async function getChecks(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, p.item, p.purchaseID, p.vendor, p.committee, p.cost, p.username,
		(SELECT CONCAT(U2.first, ' ', U2.last) FROM Users U2 WHERE U2.username = p.approvedby) approvedby
		FROM Purchases p
		WHERE p.status='Processing Reimbursement'
		AND p.check_type='Mailed' AND p.username=?`,
        [id]
    );
}

async function markReceived(id) {
    return db_conn.promise().execute(
        "UPDATE Purchases SET modifydate = NOW(), status='Reimbursed' WHERE Purchases.purchaseID=?",
        [id]
    );
}

async function expirePurchase(id) {
    return db_conn.promise().execute(
        "UPDATE Purchases SET modifydate = NOW(), status='Expired' WHERE Purchases.purchaseID=?",
        [id]
    );
}

export default {
    getFullPurchaseByID,
    createNewPurchase,
    getLastInsertedID,
    getPurchaseApprovers,
    approvePurchase,
    cancelPurchase,
    completePurchase,
    reimbursePurchases,
    getPurchaseByUser,
    getApprovalsForUser,
    getCompletionsForUser,
    getTreasurer,
    updatePurchase,
    updateReceipt,
    getAllReimbursements,
    getChecks,
    markReceived,
    expirePurchase,
};
