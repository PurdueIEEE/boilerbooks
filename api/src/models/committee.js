import { db_conn } from "./index";
import { current_fiscal_year } from "../common_items";

async function getCommitteeCategories(comm) {
    return db_conn.promise().execute(
        "SELECT category FROM Budget WHERE committee=? AND year=?",
        [comm, current_fiscal_year]
    );
}

async function getCommitteeBalance(comm) {
    return db_conn.promise().execute(
        `SELECT (SELECT SUM(amount) AS income FROM Income
        WHERE type in ('BOSO', 'Cash', 'SOGA') AND committee = ?)
        -
        (SELECT SUM(Purchases.cost) AS spend FROM Purchases
        WHERE Purchases.committee = ? AND Purchases.status IN ('Purchased','Processing Reimbursement','Reimbursed','Approved',NULL)) AS balance`,
        [comm, comm]
    );
}

export default {
    getCommitteeCategories,
    getCommitteeBalance,
}
