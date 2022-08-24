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

import { db_conn } from "./index.js";
import { max_fiscal_year_count } from "../common_items.js";

async function getCommitteeCategories(comm, year=max_fiscal_year_count) {
    return db_conn.promise().execute(
        "SELECT category FROM Budget WHERE committee=? AND fiscal_year=? AND status='Approved'",
        [comm, year]
    );
}

// Fun fact: this will return a null if there is not at least 1 purchase and at least 1 income
async function getCommitteeBalance(comm) {
    return db_conn.promise().execute(
        `SELECT (SELECT SUM(amount) AS income FROM Income
        WHERE committee = ? AND status = "Received")
        -
        (SELECT SUM(cost) AS spend FROM Purchases
        WHERE committee = ? AND status IN ('Purchased','Processing Reimbursement','Reimbursed','Approved')) AS balance`,
        [comm, comm]
    );
}

async function getCommitteeBudgetTotals(comm, year) {
    return db_conn.promise().execute(
        "SELECT SUM(Budget.amount) AS budget FROM Budget WHERE Budget.committee = ? AND Budget.fiscal_year = ? AND status='Approved'",
        [comm, year]
    );
}

async function getCommitteeExpenseTotals(comm, year) {
    return db_conn.promise().execute(
        `SELECT SUM(Purchases.cost) AS spent FROM Purchases
		WHERE Purchases.committee = ? AND Purchases.status in ('Purchased','Processing Reimbursement','Reimbursed', 'Approved', NULL)
		AND Purchases.fiscal_year = ?`,
        [comm, year]
    );
}

async function getCommitteeIncomeTotals(comm, year) {
    return db_conn.promise().execute(
        `SELECT SUM(amount) AS income FROM Income
		WHERE type in ('BOSO', 'Cash', 'SOGA') AND committee = ? AND status = 'Received'
		AND fiscal_year = ?`,
        [comm, year]
    );
}

async function getCommitteePurchases(comm, year) {
    return db_conn.promise().execute(
        `SELECT p.purchaseid, DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
		p.cost, p.comments,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
		(SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
		FROM Purchases p
		WHERE p.committee = ? AND p.fiscal_year = ? AND p.status != 'Denied'`,
        [comm, year]
    );
}

async function getCommitteePurchasesByDates(comm, start, end) {
    return db_conn.promise().execute(
        `SELECT p.purchaseid, DATE_FORMAT(p.purchasedate, '%Y-%m-%d') date, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) pby, p.item, p.vendor, p.cost, p.purchasereason
        FROM Purchases p WHERE p.committee = ? AND p.purchasedate BETWEEN ? AND ?
        AND p.status IN ('Purchased','Processing Reimbursement','Reimbursed')`,
        [comm, start, end]
    );
}

async function getCommitteeIncome(comm, year) {
    return db_conn.promise().execute(
        `SELECT *, DATE_FORMAT(updated,'%Y-%m-%d') as date, I.amount as income_amount
		FROM Income I
		WHERE I.committee = ?
		AND I.fiscal_year = ?
		ORDER BY I.updated`,
        [comm, year]
    );
}

async function getCommitteeBudgetSummary(comm, year) {
    return db_conn.promise().execute(
        `SELECT B.category, SUM(CASE WHEN (P.status in ('Purchased','Processing Reimbursement','Reimbursed', 'Approved', NULL) AND (P.committee = ?) AND (P.fiscal_year = ?)) THEN P.cost ELSE 0 END) AS spent,
        B.amount, B.status AS budget FROM Budget B
		LEFT JOIN Purchases P ON B.category = P.category
		WHERE B.committee = ?
		AND B.fiscal_year = ?
		GROUP BY B.category, B.amount, B.status`,
        [comm, year, comm, year]
    );
}

export default {
    getCommitteeCategories,
    getCommitteeBalance,
    getCommitteeBudgetTotals,
    getCommitteeExpenseTotals,
    getCommitteeIncomeTotals,
    getCommitteePurchases,
    getCommitteeIncome,
    getCommitteeBudgetSummary,
    getCommitteePurchasesByDates,
};
