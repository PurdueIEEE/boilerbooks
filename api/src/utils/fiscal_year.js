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

import { db_conn } from "./db.js";

let current_fiscal_year_string;
let current_fiscal_year_fyid;
let fiscal_year_id_to_display;

async function performLoad() {
    try {
        const [results] = await db_conn.promise().execute(
            "SELECT * FROM fiscal_year",
            []
        );

        current_fiscal_year_string = results[results.length - 1].fiscal_year;

        current_fiscal_year_fyid = results.length;

        fiscal_year_id_to_display = results.reduce((out, elm) => {
            out[elm.fyid] = elm.fiscal_year;
            return out;
        }, {});
    } catch (err) {
        throw false;
    }

    return true;
}

async function init() {
    return await performLoad();
}

async function finalize() {
    return true;
}

async function update() {
    return await performLoad();
}

// Specific exports
export {
    current_fiscal_year_string,
    current_fiscal_year_fyid,
    fiscal_year_id_to_display,
};

// Standardized exports

export default {
    init,
    finalize,
    update,
};
