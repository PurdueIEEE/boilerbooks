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
import { ACCESS_LEVEL, logger } from "../common_items.js";
import { v4 as uuidv4} from "uuid";

import bcrypt from "bcrypt";
const bcrypt_rounds = 10;

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

async function getUserApprovals(user, committee, min_level=ACCESS_LEVEL.member) {
    return db_conn.promise().execute(
        "SELECT username, committee FROM approval WHERE committee = ? AND username = ? AND privilege_level >= ?",
        [committee, user, min_level]
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

// Cannot be a promise because of bcrypt
function createUser(user, res, next) {
    bcrypt.hash(user.pass, bcrypt_rounds, function(err, hash) {
        db_conn.execute(
            "INSERT INTO Users (first,last,email,address,city,state,zip,cert,username,password, passwordreset, apikey) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '', '')",
            [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname, hash],
            function(err, results, fields) {
                if (err && err.code === "ER_DUP_ENTRY") {
                    res.status(400).send("Username already exists");
                    return next();
                }
                else if (err) {
                    logger.error(err.stack);
                    res.status(500).send("Internal Server Error");
                    return next();
                }

                const newUser = {
                    uname: user.uname,
                };
                return getUserAccessLevel(newUser, res, next);
            }
        );
    });
}

// Cannot be a promise because of bcrypt
function loginUser(userInfo, res, next) {
    db_conn.execute(
        "SELECT password, email, first, last FROM Users WHERE Users.username = ?",
        [userInfo.uname],
        function(err, results, fields) {
            if (err) {
                logger.error(err.stack);
                res.status(500).send("Internal Server Error");
                return next();
            }

            if (results.length === 0) {
                res.status(400).send("Incorrect Username or Password");
                return next();
            }

            bcrypt.compare(userInfo.pass, results[0].password, function(err, result) {
                if (!result) {
                    res.status(400).send("Incorrect Username or Password");
                    return next();
                }

                const user = {
                    uname: userInfo.uname,
                };
                return getUserAccessLevel(user, res, next);
            });
        }
    );
}

// Private method only used here
function getUserAccessLevel(user, res, next) {
    db_conn.execute(
        "SELECT MAX(A.amount) AS maxAmount, MAX(A.privilege_level) AS maxPrivilege FROM approval A WHERE A.username = ? AND A.privilege_level > ?",
        [user.uname, ACCESS_LEVEL.member],
        function(err, results, fields) {
            if (err) {
                logger.error(err.stack);
                res.status(500).send("Internal Server Error");
                return next();
            }
            // user.viewFinancials: Expected Donations, View Financials
            // user.viewApprove: Approve Purchases
            // user.viewOfficer: View Committee Dues, Committee Budgets
            // user.viewTreasurer: Reimburse Purchases, View Income, Add Dues, Adjust Access Roles
            if (results[0].maxPrivilege !== null) {
                user.viewFinancials = true;
                user.viewApprove = results[0].maxAmount > 0;
                user.viewOfficer = results[0].maxPrivilege >= ACCESS_LEVEL.officer;
                user.viewTreasurer = results[0].maxPrivilege >= ACCESS_LEVEL.treasurer;
            } else {
                user.viewFinancials = false;
                user.viewApprove = false;
                user.viewOfficer = false;
                user.viewTreasurer = false;
            }

            return generateAPIKey(user, res, next);
        }
    );
}

// Private method only used here
function generateAPIKey(user, res, next) {
    const newKey = uuidv4(); // UUIDs are not strictly great api keys
    //  but they are good enough for our purposes
    db_conn.execute(
        "UPDATE Users SET apikeygentime = NOW(), apikey = ? WHERE username = ?",
        [newKey, user.uname],
        function(err, results, fields) {
            if (err) {
                logger.error(err.stack);
                res.status(500).send("Internal Server Error");
                return next();
            }
            res.cookie("apikey", newKey, { maxAge:1000*60*60*24,}); // cookie is valid for 24 hours
            res.status(201).send(user);
            next();
        }
    );
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
};
