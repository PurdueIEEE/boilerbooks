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

import { sleep } from "../common_items.js";
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

const MAX_TRIES = 5;

// Small helper function to check the database connection by
//  aquiring a connection from the pool
function checkDB() {
    return new Promise((resolve, reject) => {
        db_conn.getConnection((err, conn) => {
            if (!err) {
                db_conn.releaseConnection(conn);
                resolve(true);
            } else {
                reject(err.message);
            }
        });
    });
}

// Loops the database check
async function loopCheckDB(try_count) {
    if (try_count == 0) {
        throw false;
    }
    try {
        return await checkDB();
    } catch (err) {
        logger.warn(`MySQL connection pool fail ${try_count}: ${err}`);
        if (try_count == 1) {
            throw false;
        }
        await sleep(1000 * (MAX_TRIES - try_count + 1));
        return await loopCheckDB(try_count - 1);
    }
}

async function init() {
    return await loopCheckDB(MAX_TRIES);
}

function finalize() {
    return new Promise((resolve, reject) => {
        db_conn.end((err) => {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}

async function update() {
    return true;
}

// Specific exports
export {
    db_conn,
};

// Standardized exports
export default {
    init,
    finalize,
    update,
};
