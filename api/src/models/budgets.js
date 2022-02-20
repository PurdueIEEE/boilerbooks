import { db_conn } from "./index";

async function clearBudget(comm, year) {
    return db_conn.promise().execute(
        "DELETE FROM Budget WHERE committee=? AND year=?",
        [comm, year]
    );
}

async function addBudget(budget) {
    return db_conn.promise().execute(
        "INSERT INTO Budget (category,amount,committee,year,status) VALUES (?,?,?,?,?)",
        [budget.category, budget.amount, budget.committee, budget.year, "Submitted"]
    );
}

async function getCommitteeSubmittedBudget(comm, year) {
    return db_conn.promise().execute(
        "SELECT category, amount FROM Budget WHERE year=? AND committee=? AND status='Submitted'",
        [year, comm]
    );
}

async function approveCommitteeBudget(comm, year) {
    console.log(comm, year);
    return db_conn.promise().execute(
        "UPDATE Budget SET status='Approved' WHERE (committee=? AND year=?)",
        [comm, year]
    );
}

export default {
    clearBudget,
    addBudget,
    getCommitteeSubmittedBudget,
    approveCommitteeBudget,
};
