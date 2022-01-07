import { db_conn } from "./index";
import { current_fiscal_year } from "../common_items";

async function getCommitteeCategories(comm) {
    return db_conn.promise().execute(
        "SELECT category FROM Budget WHERE committee=? AND year=?",
        [comm, current_fiscal_year]
    );
}

export default {
    getCommitteeCategories,
}
