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
        [budget.category, budget.amount, budget.committee, budget.year, 'Submitted']
    )
}

export default {
    clearBudget,
    addBudget,
}
