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

import account from "./account.js";
import purchase from "./purchase.js";
import committee from "./committee.js";
import income from "./income.js";
import access from "./access.js";
import budgets from "./budgets.js";
import dues from "./dues.js";

import { logger } from "../common_items.js";

import mysql2 from "mysql2";
const db_conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

db_conn.connect((err) => {
    if (err) {
        console.log(err.stack);
        process.exit(1);
    }

    logger.info("MySQL connection started");
});

export default {
    account,
    purchase,
    committee,
    income,
    access,
    budgets,
    dues,
};

export { db_conn, };
