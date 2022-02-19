import { db_conn } from "./index";
import { ACCESS_LEVEL } from "../common_items";

async function checkApprovalExists(id) {
    return db_conn.promise().execute(
        "SELECT COUNT(A.username) AS approvalexists FROM approval A WHERE A.username=? AND A.privilege_level > ?",
        [id, ACCESS_LEVEL.member]
    );
}

async function removeApproval(id) {
    return db_conn.promise().execute(
        "DELETE FROM approval WHERE username=?",
        [id]
    );
}

async function addApproval(approval) {
    return db_conn.promise().execute(
        "INSERT INTO approval (username, role, committee, amount, category, privilege_level) VALUES (?, ?, ?, ?, '*', ?)",
        [approval.username, approval.role, approval.committee, approval.amount, approval.level]
    );
}

// Treasurers are special since they have one row per committee
async function getTreasurers(level) {
    return db_conn.promise().execute(
        "SELECT A.username, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level = ? GROUP BY A.username",
        [level]
    );
}

async function getApprovals(level) {
    return db_conn.promise().execute(
        "SELECT A.username, A.role, A.committee, A.amount, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = A.username) name FROM approval A WHERE privilege_level = ?",
        [level]
    );
}

export default {
    getApprovals,
    getTreasurers,
    checkApprovalExists,
    removeApproval,
    addApproval,
};
