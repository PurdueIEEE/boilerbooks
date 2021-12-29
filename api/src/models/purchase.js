const STATUS = { 'request':0, 'approved':1, 'complete':2, 'processing':3, 'reimbursed':4 };

let purchases = {
    '1': {
        id: '1',
        purchaserID: '1',
        approverID: '',
        reimburerID: '',
        committeeID: '1',
        requestDate: '2021-11-01',
        approvalDate: '',
        completionDate: '',
        reimbursementDate: '',
        requestPrice: '10.00',
        approvalPrice: '',
        completionPrice: '',
        itemDescription: 'Test Item',
        itemVendor: 'Fake Vendor Inc',
        purchaseReason: 'Dummy Output',
        purchaseComments: '',
        purchaseCategory: 'General',
        status: STATUS.request,
    },
    '2': {
        id: '2',
        purchaserID: '2',
        approverID: '2',
        reimburerID: '2',
        committeeID: '1',
        requestDate: '2021-12-01',
        approvalDate: '2021-12-02',
        completionDate: '2021-12-03',
        reimbursementDate: '2021-12-04',
        requestPrice: '10.00',
        approvalPrice: '10.00',
        completionPrice: '10.00',
        itemDescription: 'Test Item',
        itemVendor: 'Fake Vendor Inc',
        purchaseReason: 'Dummy Output',
        purchaseComments: 'This is a test purchase',
        purchaseCategory: 'General',
        status: STATUS.reimbursed,
    }
};

function getPurchaseByID(id) {
    if(id in purchases) {
        return purchases[id];
    }

    return undefined;
}

function createNewPurchase(id, purchase) {
    purchases[id] = purchase;
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

function getPurchaseByUser(id) {
    let userPurchases = [];
    for(let purchase in purchases) {
        if(purchases[purchase].purchaserID === id) {
            userPurchases.push(purchases[purchase]);
        }
    }

    return userPurchases;
}

export default {
    STATUS,
    getPurchaseByID,
    createNewPurchase,
    approvePurchase,
    completePurchase,
    updatePurchaseStatus,
    getPurchaseByUser,
}
