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
import { ACCESS_LEVEL } from "../common_items.js";
import { v4 as uuidv4} from "uuid";

async function getUserByID(id) {
    return db_conn.promise().execute(
        "SELECT email, first, last, address, city, state, zip FROM Users WHERE username = ?",
        [id]
    );
}

async function getUserByEmail(email) {
    return db_conn.promise().execute(
        "SELECT username FROM Users WHERE email = ?",
        [email]
    );
}

async function updateUser(user) {
    return db_conn.promise().execute(
        "UPDATE Users SET modifydate=NOW(), first=?, last=?, email=?, address=?, city=?, state=?, zip=? WHERE username=?",
        [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname]
    );
}

async function getUserApprovals(user, committee="%", min_level=ACCESS_LEVEL.member) {
    return db_conn.promise().execute(
        "SELECT username, committee FROM approval WHERE (committee LIKE ?) AND username = ? AND privilege_level >= ?",
        [committee, user, min_level]
    );
}

async function canApprovePurchase(user, purchase) {
    return db_conn.promise().execute(
        `SELECT 1 FROM Purchases p INNER JOIN approval a ON p.committee = a.committee
        WHERE p.purchaseID = ?
        AND a.username = ?
        AND p.cost <= (SELECT MAX(ap.amount) FROM approval ap
        WHERE ap.username = ?
        AND ap.committee = p.committee)`,
        [purchase, user, user]
    );
}

async function getUserTreasurer(user) {
    return db_conn.promise().execute(
        `SELECT COUNT(U3.username) as validuser FROM Users U3
        INNER JOIN approval A ON U3.username = A.username
        WHERE A.role >= ? AND U3.username = ?`,
        [ACCESS_LEVEL.treasurer, user]
    );
}

async function getUserApprovalCommittees(user) {
    return db_conn.promise().execute(
        "SELECT committee FROM approval WHERE username = ? AND privilege_level > ?",
        [user, ACCESS_LEVEL.member]
    );
}

async function getUserDues(user) {
    return db_conn.promise().execute(
        `SELECT D.duesid, D.name, D.email, D.committee, D.amount, D.status,
        (SELECT fiscal_year FROM fiscal_year WHERE fyid = D.fiscal_year) fiscal_year
        FROM Dues D
        INNER JOIN Users U ON D.email = U.email
        WHERE U.username=?`,
        [user]
    );
}

async function getLastPurchaseCommittee(user) {
    return db_conn.promise().execute(
        "SELECT purchaseid, committee FROM Purchases WHERE username=? ORDER BY purchaseid DESC",
        [user]
    );
}

async function getLastIncomeCommittee(user) {
    return db_conn.promise().execute(
        "SELECT incomeid, committee FROM Income WHERE addedby=? ORDER BY incomeid DESC",
        [user]
    );
}


async function updatePassword(user) {
    return db_conn.promise().execute(
        "UPDATE Users SET modifydate=NOW(), password=?, resettime=NULL WHERE username=?",
        [user.pass, user.uname]
    );
}

async function setPasswordResetDetails(user, rstlink) {
    return db_conn.promise().execute(
        "UPDATE Users SET resettime=NOW(), passwordreset=?, modifydate=NOW() WHERE username=?",
        [rstlink, user]
    );
}

async function checkResetTime(user, rstlink) {
    return db_conn.promise().execute(
        "SELECT resettime FROM Users WHERE username=? AND passwordreset=?",
        [user, rstlink]
    );
}

async function createUser(user, hash) {
    return db_conn.promise().execute(
        "INSERT INTO Users (first,last,email,address,city,state,zip,cert,username,password, passwordreset, apikey) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '', '')",
        [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname, hash]
    );
}

async function loginUser(user) {
    return db_conn.promise().execute(
        "SELECT password, email, first, last FROM Users WHERE Users.username = ?",
        [user]
    );
}

async function getUserAccessLevel(user) {
    return db_conn.promise().execute(
        "SELECT MAX(A.amount) AS maxAmount, MAX(A.privilege_level) AS maxPrivilege FROM approval A WHERE A.username = ? AND A.privilege_level > ?",
        [user, ACCESS_LEVEL.member]
    );
}

async function generateAPIKey(user) {

    // Yeah technically this while loop is always true
    // but this is a hacky fix to an unlikey problem so eh
    // eslint-disable-next-line
    while (true) {
        let newKey = uuidv4(); // UUIDs are not strictly great api keys
        //  but they are good enough for our purposes

        // test for the (unlikely) situation that the generated
        //   api key already exists
        const [test] = await db_conn.promise().execute(
            "SELECT username FROM Users WHERE apikey=?",
            [newKey]
        );
        if (test.length !== 0) continue;

        await db_conn.promise().execute(
            "UPDATE Users SET apikeygentime = NOW(), apikey = ? WHERE username = ?",
            [newKey, user]
        );
        return newKey;
    }
}

export default {
    getUserByID,
    getUserByEmail,
    createUser,
    loginUser,
    updateUser,
    updatePassword,
    getUserApprovals,
    getUserTreasurer,
    getUserApprovalCommittees,
    setPasswordResetDetails,
    checkResetTime,
    getUserDues,
    getLastPurchaseCommittee,
    getLastIncomeCommittee,
    canApprovePurchase,
    getUserAccessLevel,
    generateAPIKey,
};
