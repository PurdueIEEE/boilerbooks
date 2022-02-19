import { db_conn } from "./index";

async function clearBudget(comm, year) {
    return db_conn.promise().execute(
        "DELETE FROM Budget WHERE committee=? AND fiscalyear=?",
        [comm, year]
    );
}

export default {
    clearBudget,
}
