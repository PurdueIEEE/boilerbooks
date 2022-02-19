import { db_conn } from "./index";
import { current_fiscal_year } from "../common_items";

async function createNewDonation(donation) {
    return db_conn.promise().execute(
        "INSERT INTO Income (updated, committee, source, amount, item, type, status, comments, addedby, fiscalyear, refnumber) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, '')",
        [donation.committee, donation.source, donation.amount, donation.item, donation.type, donation.status, donation.comments, donation.user, current_fiscal_year]
    );
}

async function getAllIncome() {
    return db_conn.promise().execute(
        "SELECT DATE_FORMAT(i.updated,'%Y-%m-%d') as date,i.source,i.type,i.committee,i.amount,i.item,i.incomeid,i.status,i.refnumber FROM Income i ORDER BY i.updated DESC",
        []
    );
}

async function updateIncome(income) {
    return db_conn.promise().execute(
        "UPDATE Income SET status=?, refnumber=? WHERE Income.incomeid = ?",
        [income.status, income.refnumber, income.id]
    );
}

export default {
    createNewDonation,
    getAllIncome,
    updateIncome,
};
