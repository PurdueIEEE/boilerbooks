import { db_conn, current_fiscal_year } from './index';

async function getFullPurchaseByID(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%m-%d-%Y') as date, DATE_FORMAT(p.modifydate, '%Y-%d-%m %h:%i:%s %p') as mdate, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
        p.cost, p.comments, p.fundsource, p.fiscalyear, p.username, p.purchaseid,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.username) purchasedby,
        (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
        FROM Purchases p
        WHERE p.purchaseID = ?`,
        [id]
    );
}

async function createNewPurchase(purchase) {
    return db_conn.promise().execute(
        "INSERT INTO Purchases (username,item,purchasereason,vendor,committee,category,cost,status,comments) VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested', ?)",
        [purchase.user, purchase.item, purchase.reason, purchase.vendor, purchase.committee, purchase.category, purchase.price, purchase.comments]
    );
}

async function approvePurchase(purchase) {
    return db_conn.promise().execute(
        `UPDATE Purchases SET modifydate = NOW(), approvedby=?, item=?, purchasereason=?, vendor=?,
        cost=?, status=?, fundsource=?, comments=?
        WHERE Purchases.purchaseID = ? AND
        Purchases.status='Requested'`,
        [purchase.approver, purchase.item, purchase.reason, purchase.vendor, purchase.cost, purchase.status, purchase.fundsource, purchase.comments, purchase.id]
    );
}

async function cancelPurchase(id) {
    return db_conn.promise().execute(
        `Update Purchases SET modifydate = NOW(), status=?
        WHERE (Purchases.purchaseID = ?) AND
        (Purchases.status='Requested' OR Purchases.status='Approved')`,
        ['Denied', id]
    )
}

function completePurchase(id, purchase) {
    purchases[id] = purchase;
}

function updatePurchaseStatus(id, purchase) {
    purchases[id] = purchase;
}

async function getPurchaseByUser(id) {
    return db_conn.promise().execute(
        `SELECT DATE_FORMAT(p.purchasedate,'%Y-%m-%d') as date, p.purchaseid, p.item, p.purchasereason, p.vendor, p.committee, p.category, p.receipt, p.status,
		p.cost, p.comments, p.username purchasedby, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = p.approvedby) approvedby
		FROM Purchases p
		WHERE p.username = ?
		ORDER BY p.purchasedate`,
        [id]
    );
}

async function getApprovalsForUser(id) {
    return db_conn.promise().execute(
        `SELECT DISTINCT p.purchaseID, p.item FROM Purchases p
        INNER JOIN approval a on p.committee = a.committee
        WHERE p.status = 'Requested'
        AND a.username = ?
        AND (a.category = p.category OR a.category = '*')
        AND p.cost <= (SELECT MAX(ap.amount) FROM approval ap
        WHERE ap.username = ?
        AND ap.committee = p.committee)`,
        [id, id]
    );
}

function getPurchaseByCommittee(id) {
    let commPurchases = [];
    for(let purchase in purchases) {
        if(purchases[purchase].committeeID === id) {
            commPurchases.push(purchases[purchase]);
        }
    }

    return commPurchases;
}

export default {
    getFullPurchaseByID,
    createNewPurchase,
    approvePurchase,
    cancelPurchase,
    completePurchase,
    updatePurchaseStatus,
    getPurchaseByUser,
    getApprovalsForUser,
    getPurchaseByCommittee,
}
