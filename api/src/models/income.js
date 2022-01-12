import { db_conn } from "./index";
import { current_fiscal_year } from "../common_items";

async function createNewDonation(donation) {
    return db_conn.promise().execute(
        `INSERT INTO Income (updated, committee, source, amount, item, type, status, comments, addedby, fiscalyear, refnumber) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, '')`,
        [donation.committee, donation.source, donation.amount, donation.item, donation.type, donation.status, donation.comments, donation.user, current_fiscal_year]
    );
}

export default {
    createNewDonation,
}
