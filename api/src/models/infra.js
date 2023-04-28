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

async function getAllCommittees() {
    return db_conn.promise().execute(
        "SELECT * FROM committees",
        []
    );
}

async function getCommitteeByID(id) {
    return db_conn.promise().execute(
        "SELECT * FROM committees WHERE committee_id = ?",
        [id]
    );
}

async function updateCommitteeDetails(id, comm) {
    return db_conn.promise().execute(
        "UPDATE committees SET display_name=?, api_name=?, bank_status=?, dues_status=? WHERE committee_id=?",
        [comm.display_name, comm.api_name, comm.bank_status, comm.dues_status, id]
    );
}

async function addNewCommittee(comm) {
    return db_conn.promise().execute(
        "INSERT INTO committees (display_name, api_name, bank_status, dues_status) VALUES (?,?,?,?)",
        [comm.display_name, comm.api_name, comm.bank_status, comm.dues_status]
    );
}

async function getAllFiscalYears() {
    return db_conn.promise().execute(
        "SELECT * FROM fiscal_year",
        []
    );
}

async function createNewFiscalYear(string) {
    return db_conn.promise().execute(
        "INSERT INTO fiscal_year (fiscal_year) VALUES (?)",
        [string]
    );
}

export default {
    getAllCommittees,
    getCommitteeByID,
    updateCommitteeDetails,
    addNewCommittee,
    getAllFiscalYears,
    createNewFiscalYear,
};
