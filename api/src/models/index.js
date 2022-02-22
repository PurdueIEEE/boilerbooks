import account from "./account";
import purchase from "./purchase";
import committee from "./committee";
import income from "./income";
import access from "./access";
import budgets from "./budgets";

import { logger } from "../common_items";

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
};

export { db_conn, };
