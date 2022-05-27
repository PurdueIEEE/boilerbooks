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
import { dues_amount, max_fiscal_year_count } from "../common_items.js";

async function createNewMember(dues) {
    return db_conn.promise().execute(
        `INSERT INTO Dues (timestamp, name, email, id_hash, committee, fiscal_year, amount, status)
        VALUES (NOW(), ?,?,?,?,?,?,'Unpaid')`,
        [dues.name, dues.email, dues.puid, dues.committees, max_fiscal_year_count, dues_amount]
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
        "SELECT D.duesid, D.name, D.email, D.committee, (SELECT fiscal_year FROM fiscal_year WHERE fyid=D.fiscal_year) AS fiscal_year, D.status FROM Dues D WHERE fiscal_year=?",
        [year]
    );
}

async function updateDuesMemberStatus(id, status) {
    return db_conn.promise().execute(
        "UPDATE Dues SET status=? WHERE duesid=?",
        [status, id]
    );
}

export default {
    createNewMember,
    getMemberByEmail,
    getDuesMembers,
    updateDuesMemberStatus,
};
