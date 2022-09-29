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

async function search(params) {
    // These lines seem useless, but they are very important!
    //  we are dynamically creating this query, so we are passing in
    //  a value the user gave us into the query string.
    //  This is considered A Bad Idea(tm) so we are sanitizing the input
    //  and limiting the values we can select to known safe ones.
    const joiner = params.joiner === "OR" ? "OR" : "AND";
    const itemModifier = params.itemModifier === "LIKE" ? "LIKE" : (params.itemModifier === "EXACTLY" ? "=" : "NOT LIKE");
    const vendorModifier = params.vendorModifier === "LIKE" ? "LIKE" : (params.vendorModifier === "EXACTLY" ? "=" : "NOT LIKE");
    const reasonModifier = params.reasonModifier === "LIKE" ? "LIKE" : (params.reasonModifier === "EXACTLY" ? "=" : "NOT LIKE");
    return db_conn.promise().execute(
        `SELECT p.item, p.purchaseID FROM Purchases p WHERE
        (p.committee LIKE ?) AND
        ((LOWER(p.item) ${itemModifier} ?) ${joiner}
        (LOWER(p.vendor) ${vendorModifier} ?) ${joiner}
        (LOWER(p.purchasereason) ${reasonModifier} ?))`,
        [selectInput(params.committee, 'any', '%'), selectInput(params.itemKey, '', '%'), selectInput(params.vendorKey, '', '%'), selectInput(params.reasonKey, '', '%')]
    );
}

// helper method to check if an input is a sepcial string and return a special value
function selectInput(input, check, value) {
    return input === check ? value : `%${input.toLowerCase()}%`;
}

export default {
    search,
}
