import { db_conn, current_fiscal_year } from "./index";

async function getCommitteeCategories(comm, res) {
    return db_conn.promise().execute(
        "SELECT category FROM Budget WHERE committee=? AND year=?",
        [comm, current_fiscal_year]
    )
}

export default {
    getCommitteeCategories,
}
