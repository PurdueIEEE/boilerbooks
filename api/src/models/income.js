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

async function createNewDonation(donation) {
    return db_conn.promise().execute(
        "INSERT INTO Income (updated, committee, source, amount, item, type, status, comments, addedby, fiscal_year, refnumber) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, '')",
        [donation.committee, donation.source, donation.amount, donation.item, donation.type, donation.status, donation.comments, donation.user, max_fiscal_year_count]
    );
}

async function getAllIncome() {
    return db_conn.promise().execute(
        "SELECT DATE_FORMAT(i.updated,'%Y-%m-%d') as date,i.source,i.type,i.committee,i.amount,i.item,i.incomeid,i.status,i.refnumber FROM Income i ORDER BY i.updated DESC",
        []
    );
}

async function updateIncome(income) {
    return db_conn.promise().execute(
        "UPDATE Income SET status=?, refnumber=? WHERE Income.incomeid = ?",
        [income.status, income.refnumber, income.id]
    );
}

export default {
    createNewDonation,
    getAllIncome,
    updateIncome,
};
