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
        WHERE type in ('BOSO', 'Cash', 'SOGA') AND committee = ? AND status = ?)
        -
        (SELECT SUM(Purchases.cost) AS spend FROM Purchases
        WHERE Purchases.committee = ? AND Purchases.status IN ('Purchased','Processing Reimbursement','Reimbursed','Approved',NULL)) AS balance`,
        [comm, 'Received', comm]
    );
}

async function getCommitteeBudgetTotals(comm, year) {
    return db_conn.promise().execute(
        "SELECT SUM(Budget.amount) AS budget FROM Budget WHERE Budget.committee = ? AND Budget.year = ?",
        [comm, year]
    );
}

async function getCommitteeExpenseTotals(comm, year) {
    return db_conn.promise().execute(
        `SELECT SUM(Purchases.cost) AS spent FROM Purchases
		WHERE Purchases.committee = ? AND Purchases.status in ('Purchased','Processing Reimbursement','Reimbursed', 'Approved', NULL)
		AND Purchases.fiscalyear = ?`,
        [comm, year]
    );
}

async function getCommitteeIncomeTotals(comm, year) {
    return db_conn.promise().execute(
        `SELECT SUM(amount) AS income FROM Income
		WHERE type in ('BOSO', 'Cash', 'SOGA') AND committee = ? AND status = 'Received'
		AND fiscalyear = ?`,
        [comm, year]
    );
}

export default {
    getCommitteeCategories,
    getCommitteeBalance,
    getCommitteeBudgetTotals,
    getCommitteeExpenseTotals,
    getCommitteeIncomeTotals,
}
