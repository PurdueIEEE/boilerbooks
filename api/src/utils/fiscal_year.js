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

let current_fiscal_year;
let first_fiscal_year;
let min_fiscal_year_count;
let max_fiscal_year_count;
let fiscal_year_list;
let fiscal_year_lut;

async function performLoad() {
    try {
        const [results] = await db_conn.promise().execute(
            "SELECT * FROM fiscal_year",
            []
        );

        current_fiscal_year = results[results.length - 1].fiscal_year;
        first_fiscal_year = results[0].fiscal_year;

        min_fiscal_year_count = 1;
        max_fiscal_year_count = results.length;

        fiscal_year_list = results.reduce((out, elm) => {
            out.push(elm.fiscal_year);
            return out;
        }, []);

        fiscal_year_lut = results.reduce((out, elm) => {
            out[elm.fiscal_year] = elm.fyid;
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
    current_fiscal_year,
    first_fiscal_year,
    min_fiscal_year_count,
    max_fiscal_year_count,
    fiscal_year_list,
    fiscal_year_lut,
};

// Standardized exports

export default {
    init,
    finalize,
    update,
};
