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
import { max_fiscal_year_count } from "../common_items.js";

async function createNewMember(dues) {
    return db_conn.promise().execute(
        `INSERT INTO Dues (timestamp, name, email, id_hash, committee, fiscal_year, amount, status)
        VALUES (NOW(), ?,?,?,?,?,?,'Unpaid')`,
        [dues.name, dues.email, dues.puid, dues.committees, max_fiscal_year_count, 0]
    );
}

async function getMemberByEmail(email, fiscal_year) {
    return db_conn.promise().execute(
        "SELECT email FROM Dues WHERE email=? AND fiscal_year=?",
        [email, fiscal_year]
    );
}

async function getDuesMembers(year) {
    return db_conn.promise().execute(
        "SELECT D.duesid, D.name, D.email, D.committee, D.amount, (SELECT fiscal_year FROM fiscal_year WHERE fyid=D.fiscal_year) AS fiscal_year, D.status FROM Dues D WHERE fiscal_year=?",
        [year]
    );
}

async function updateDuesMemberStatus(id, status, amount) {
    return db_conn.promise().execute(
        "UPDATE Dues SET status=?, amount=? WHERE duesid=?",
        [status, amount, id]
    );
}

async function updateMemberDetails(id, dues) {
    return db_conn.promise().execute(
        "UPDATE Dues SET name=?, email=?, committee=? WHERE duesid=?",
        [dues.name, dues.email, dues.committees, id]
    );
}

async function getDuesIncomeActual(year) {
    return db_conn.promise().execute(
        `SELECT I.incomeid, I.source, I.amount, I.refnumber, I.status,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = I.addedby) addedbyname,
        (SELECT F.fiscal_year FROM fiscal_year F WHERE F.fyid=I.fiscal_year)
        FROM Income I
        WHERE LOWER(I.source) LIKE '%dues%'
        AND I.fiscal_year = ?`,
        [year]
    );
}

async function getDuesIncomeExpected(year) {
    return db_conn.promise().execute(
        "SELECT amount FROM Dues WHERE fiscal_year=? AND status IN ('Paid', 'Unpaid')",
        [year]
    );
}

export default {
    createNewMember,
    getMemberByEmail,
    getDuesMembers,
    updateDuesMemberStatus,
    getDuesIncomeActual,
    getDuesIncomeExpected,
    updateMemberDetails,
};
