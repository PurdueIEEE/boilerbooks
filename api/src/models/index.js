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
import search from "./search.js";

import { logger } from "../utils/logging.js";

import mysql2 from "mysql2";

// Using a pool allows connections to be remade
//   Normally, MySQL will kill a connection if it was not
//   used recently. Pooling them should remove that overhead
//   check from our code and move it into the library.
const db_conn = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    decimalNumbers: true,
});

// Backoff pool startup check
let try_count = 0;
let db_good = false;
function db_startup() {
    db_conn.getConnection((err, conn) => {
        if (!err) {
            logger.info("MySQL connection pool started");
            db_conn.releaseConnection(conn);
            db_good = true;
            return;
        }
        logger.error(`MySQL connection pool fail ${try_count}: ${err.message}`);
        try_count += 1;
        if (try_count >= 5) {
            logger.error("MySQL connection pool failed to start");
            process.exit(1);
        }
        setTimeout(db_startup, try_count * 1000); // Retry the startup, backoff longer each time
    });
}
function db_check() {
    return db_good;
}
db_startup();

export default {
    account,
    purchase,
    committee,
    income,
    access,
    budgets,
    dues,
    search,
};

export { db_conn, db_check, };
