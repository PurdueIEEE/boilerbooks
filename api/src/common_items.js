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

// variables, functions, enums, etc. that are used elsewhere in the code

// -------------- fiscal year globals -------------

/** CHANGE BELOW ANNUALLY **/
const current_fiscal_year = "2022-2023";
/** CHANGE ABOVE ANNUALLY **/

const first_fiscal_year = "2015-2016";
const yearStart = parseInt(first_fiscal_year.substring(0,4));
const yearEnd = parseInt(current_fiscal_year.substring(0,4));
const fiscal_year_list = [];
for (let year = yearEnd; year >= yearStart; year--) {
    fiscal_year_list.push(`${year}-${year+1}`);
}
const fiscal_year_lut = fiscal_year_list.slice().reverse().reduce(
    (result, curr, index, array) => {
        result[curr] = index+1;
        return result;
    }, {});
const min_fiscal_year_count = 1;
const max_fiscal_year_count = fiscal_year_list.length;
// -------------------------------------------------

// ----------------- dues amount -------------------
// Current annual local dues

/** CHANGE BELOW ANNUALLY **/
const dues_amount = [15, 10];
/** CHANGE ABOVE ANNUALLY **/

// -------------------------------------------------

// --------------- access level enum ---------------
// *sigh* enums don't exist in js so this is the best approximation
// Going by 2 so that values can be added in between without needing to change the database.
const ACCESS_LEVEL = Object.freeze({
    "member":0,
    "internal_leader":2,
    "officer":4,
    "treasurer":6,
});
// -------------------------------------------------

// ---------------- utf-8 -> ascii -----------------
function cleanUTF8(input) {
    let clean = "";
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) > 127) {
            clean += `&#${input.charCodeAt(i)};`;
        } else {
            clean += input[i];
        }
    }
}
// -------------------------------------------------

// ---------------- fake sleep func ----------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// -------------------------------------------------

export {
    current_fiscal_year,
    first_fiscal_year,
    fiscal_year_list,
    fiscal_year_lut,
    min_fiscal_year_count,
    max_fiscal_year_count,
    dues_amount,
    ACCESS_LEVEL,
    cleanUTF8,
    sleep,
};
