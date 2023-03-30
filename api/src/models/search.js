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

import { ACCESS_LEVEL } from "../common_items.js";
import { db_conn } from "./index.js";

async function search(params, id) {
    // These lines seem useless, but they are very important!
    //  We are dynamically creating this query, so we are passing in
    //  a value the user gave us into the query string.
    //  This is considered A Bad Idea(tm) so we are sanitizing the input
    //  and limiting the values we can select to known safe ones.
    const joiner = params.joiner === "OR" ? "OR" : "AND";
    const itemModifier = params.itemModifier === "LIKE" ? "LIKE" : (params.itemModifier === "EXACTLY" ? "=" : "NOT LIKE");
    const vendorModifier = params.vendorModifier === "LIKE" ? "LIKE" : (params.vendorModifier === "EXACTLY" ? "=" : "NOT LIKE");
    const reasonModifier = params.reasonModifier === "LIKE" ? "LIKE" : (params.reasonModifier === "EXACTLY" ? "=" : "NOT LIKE");
    const fiscalyearModifier = params.fiscalyear !== "any" ? "=" : ">=";
    return db_conn.promise().execute(
        `SELECT p.item, p.purchaseID, p.committee, p.status, DATE_FORMAT(p.purchasedate,'%m-%d-%Y') as date, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby
        FROM Purchases p WHERE
        (p.committee IN (SELECT ap.committee FROM approval ap WHERE ap.username = ? AND ap.privilege_level > ?)) AND
        (CONVERT(p.committee, CHAR) LIKE ?) AND
        (p.fiscal_year ${fiscalyearModifier} ?) AND
        ((LOWER(p.item) ${itemModifier} ?) ${joiner}
        (LOWER(p.vendor) ${vendorModifier} ?) ${joiner}
        (LOWER(p.purchasereason) ${reasonModifier} ?))`,
        [id, ACCESS_LEVEL.member, selectInput(params.committee.toString(), "any", "%"), params.fiscalyear === "any" ? 0 : params.fiscalyear, selectInput(params.itemKey, "", "%"), selectInput(params.vendorKey, "", "%"), selectInput(params.reasonKey, "", "%")]
    );
}

// helper method to check if an input is a sepcial string and return a special value
function selectInput(input, check, value) {
    return input === check ? value : `%${input.toLowerCase()}%`;
}

export default {
    search,
};
