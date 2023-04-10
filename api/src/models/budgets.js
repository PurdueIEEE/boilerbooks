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

import { db_conn } from "../utils/db.js";

async function clearBudget(comm, year) {
    return db_conn.promise().execute(
        "DELETE FROM Budget WHERE committee=? AND fiscal_year=?",
        [comm, year]
    );
}

async function addBudget(budget) {
    return db_conn.promise().execute(
        "INSERT INTO Budget (category,amount,committee,fiscal_year,status) VALUES (?,?,?,?,?)",
        [budget.category, budget.amount, budget.committee, budget.year, "Submitted"]
    );
}

async function getCommitteeSubmittedBudget(comm, year) {
    return db_conn.promise().execute(
        "SELECT category, amount FROM Budget WHERE fiscal_year=? AND committee=? AND status='Submitted'",
        [year, comm]
    );
}

async function approveCommitteeBudget(comm, year) {
    return db_conn.promise().execute(
        "UPDATE Budget SET status='Approved' WHERE (committee=? AND fiscal_year=?)",
        [comm, year]
    );
}

export default {
    clearBudget,
    addBudget,
    getCommitteeSubmittedBudget,
    approveCommitteeBudget,
};
