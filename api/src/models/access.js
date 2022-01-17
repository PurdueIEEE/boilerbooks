import { db_conn } from "./index";
import { ACCESS_LEVEL } from "../common_items";

async function getTreasurers () {
    return db_conn.promise().execute(
        "SELECT A.username, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level >= ? GROUP BY A.username",
        [ACCESS_LEVEL.treasurer]
    );
}

async function removeTreasurer (id) {
    return db_conn.promise().execute(
        "UPDATE approval SET privilege_level=? WHERE username=?",
        [ACCESS_LEVEL.member, id]
    );
}

export default {
    getTreasurers,
    removeTreasurer,
};
