import { db_conn, current_fiscal_year } from "./index";

function getCommitteeCategories(comm, res) {
    db_conn.execute(
        "SELECT category FROM Budget WHERE committee=? AND year=?",
        [comm, current_fiscal_year],
        function(err, results, fields) {
            if (err) {
                console.log('MySQL ' + err.stack);
                return res.status(500).send("Internal Server Error");
            }

            return res.status(200).send(results);
        }
    )
}

export default {
    getCommitteeCategories,
}
