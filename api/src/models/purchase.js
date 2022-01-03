import { db_conn, current_fiscal_year } from './index';

function getPurchaseByID(id) {
    if(id in purchases) {
        return purchases[id];
    }

    return undefined;
}

async function createNewPurchase(purchase) {
    return db_conn.promise().execute(
        "INSERT INTO Purchases (username,item,purchasereason,vendor,committee,category,cost,status,comments) VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested', ?)",
        [purchase.user, purchase.item, purchase.reason, purchase.vendor, purchase.committee, purchase.category, purchase.price, purchase.comments]
    )
}

function approvePurchase(id, purchase) {
    purchases[id] = purchase;
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
    )
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
    getPurchaseByID,
    createNewPurchase,
    approvePurchase,
    completePurchase,
    updatePurchaseStatus,
    getPurchaseByUser,
    getPurchaseByCommittee,
}
