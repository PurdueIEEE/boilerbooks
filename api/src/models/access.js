import { db_conn } from "./index";
import { ACCESS_LEVEL } from "../common_items";

async function checkApprovalExists (id) {
    return db_conn.promise().execute(
        "SELECT COUNT(A.username) AS approvalexists FROM approval A WHERE A.username=? AND A.privilege_level > ?",
        [id, ACCESS_LEVEL.member]
    );
}

async function removeApproval (id) {
    return db_conn.promise().execute(
        "DELETE FROM approval WHERE username=?",
        [id]
    );
}

async function addApproval (approval) {
    return db_conn.promise().execute(
        "INSERT INTO approval (username, role, committee, amount, category, privilege_level) VALUES (?, ?, ?, ?, '*', ?)",
        [approval.username, approval.role, approval.committee, approval.amount, approval.level]
    );
}

async function getTreasurers () {
    return db_conn.promise().execute(
        "SELECT A.username,(SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level >= ? GROUP BY A.username",
        [ACCESS_LEVEL.treasurer]
    );
}

export default {
    getTreasurers,
    checkApprovalExists,
    removeApproval,
    addApproval,
};
