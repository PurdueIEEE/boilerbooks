import account from './account';
import purchase from './purchase';
import committee from './committee';

const mysql2 = require('mysql2');
const db_conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

db_conn.connect((err) => {
    if (err) {
        console.log("MySQL " + err.stack);
        process.exit(1);
    }

    console.log("MySQL connection started");
});

// --------- Modify these numbers annually ---------
const current_fiscal_year = "2017-2018";
const first_fiscal_year = "2015-2016";
// -------------------------------------------------

export default {
    account,
    purchase,
    committee
}

export { db_conn, current_fiscal_year, first_fiscal_year };
