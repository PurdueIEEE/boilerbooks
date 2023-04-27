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

import { logger } from "./logging.js";
import { db_conn } from "./db.js";

let committee_display_to_id;
let committee_id_to_display;
let dues_committees;

async function performLoad() {
    try {
        const [results] = await db_conn.promise().execute(
            "SELECT * FROM committees",
            []
        );

        committee_display_to_id = results.reduce((out, elm) => {
            if (elm.bank_status === "Active") {
                out[elm.display_name] = elm.committee_id;
            }
            return out;
        }, {});

        committee_id_to_display = results.reduce((out, elm) => {
            if (elm.bank_status === "Active") {
                out[elm.committee_id] = elm.display_name;
            }
            return out;
        }, {});

        dues_committees = results.reduce((out, elm) => {
            if (elm.dues_status === "Active") {
                out.push(elm.display_name);
            }
            return out;
        }, []);

    } catch (err) {
        return false;
    }

    return true;
}

async function init() {
    const load_success = await performLoad();
    if (!load_success) {
        throw false;
    }
    return true;
}

async function finalize() {
    return true;
}

async function update() {
    const load_success = await performLoad();
    if (!load_success) {
        logger.warn("Committee Loader failed, application may run in a degraded state!");
        throw false;
    }
    return true;
}

// Specific exports
export {
    committee_display_to_id,
    committee_id_to_display,
    dues_committees,
};

// Standardized exports
export default {
    init,
    finalize,
    update,
};
