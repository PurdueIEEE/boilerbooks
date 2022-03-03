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
import { current_fiscal_year, dues_amount } from "../common_items.js";

async function createNewMember(dues) {
    return db_conn.promise().execute(
        `INSERT INTO Dues (timestamp, name, email, id_hash, committee, fiscal_year, amount)
        VALUES (NOW(), ?,?,?,?,?,?)`,
        [dues.name, dues.email, dues.puid, dues.committees, current_fiscal_year, dues_amount]
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
        "SELECT name, email, committee FROM Dues WHERE fiscal_year=?",
        [year]
    );
}

export default {
    createNewMember,
    getMemberByEmail,
    getDuesMembers
}
