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

async function checkApprovalExists(id) {
    return db_conn.promise().execute(
        "SELECT COUNT(A.username) AS approvalexists FROM approval A WHERE A.username=? AND A.privilege_level > ?",
        [id, ACCESS_LEVEL.member]
    );
}

async function removeApproval(id) {
    return db_conn.promise().execute(
        "DELETE FROM approval WHERE username=?",
        [id]
    );
}

async function addApproval(approval) {
    return db_conn.promise().execute(
        "INSERT INTO approval (username, role, committee, amount, category, privilege_level) VALUES (?, ?, ?, ?, '*', ?)",
        [approval.username, approval.role, approval.committee, approval.amount, approval.level]
    );
}

// Treasurers are special since they have one row per committee
async function getTreasurers(level) {
    return db_conn.promise().execute(
        "SELECT A.username, A.role, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level = ? GROUP BY A.username, A.role",
        [level]
    );
}

async function getApprovals(level) {
    return db_conn.promise().execute(
        "SELECT A.username, A.role, A.committee, A.amount, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level = ?",
        [level]
    );
}

export default {
    getApprovals,
    getTreasurers,
    checkApprovalExists,
    removeApproval,
    addApproval,
};
