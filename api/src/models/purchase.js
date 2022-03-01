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
import { ACCESS_LEVEL, current_fiscal_year } from "../common_items.js";

async function getFullPurchaseByID(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%m-%d-%Y') as date, DATE_FORMAT(p.modifydate, '%Y-%d-%m %h:%i:%s %p') as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
        p.cost, p.comments, p.fundsource, p.fiscalyear, p.username, p.purchaseid,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
        FROM Purchases p
        WHERE p.purchaseID = ?`,
        [id]
    );
}

async function createNewPurchase(purchase) {
    return db_conn.promise().execute(
        "INSERT INTO Purchases (fiscalyear,username,item,purchasereason,vendor,committee,category,cost,status,comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Requested', ?)",
        [current_fiscal_year, purchase.user, purchase.item, purchase.reason, purchase.vendor, purchase.committee, purchase.category, purchase.price, purchase.comments]
    );
}

async function updatePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), cost=?, vendor=?, purchasereason=?, comments=?
        WHERE Purchases.purchaseID=? AND Purchases.status IN ('Requested', 'Approved', 'Purchased')`,
        [purchase.cost, purchase.vendor, purchase.reason, purchase.comments, purchase.purchaseID]
    );
}

async function updateReceipt(id, receipt) {
    return db_conn.promise().execute(
        "Update Purchases SET receipt=? WHERE Purchases.purchaseID=?",
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

async function approvePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), approvedby=?, item=?, purchasereason=?, vendor=?,
        cost=?, status=?, fundsource=?, comments=?
        WHERE Purchases.purchaseID = ? AND
        Purchases.status='Requested'`,
        [purchase.approver, purchase.item, purchase.reason, purchase.vendor, purchase.cost, purchase.status, purchase.fundsource, purchase.comments, purchase.id]
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
        [purchase.purchasedate, purchase.cost, "Purchased", purchase.comments, purchase.receipt, purchase.id]
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
		FROM Purchases p
		WHERE p.username = ?
		ORDER BY p.purchasedate`,
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
};
