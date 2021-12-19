let purchases = {
    '1': {
        id: '1',
        requesterID: '1',
        approverID: '1',
        committeeID: '1',
        requestDate: '1639885017',
        approvalDate: '1639885018',
        completionDate: '1639885019',
        requestPrice: '10.00',
        approvalPrice: '10.00',
        completionPrice: '10.00',
        itemDescription: 'Test Item',
        itemVendor: 'Fake Vendor Inc',
        purchaseReason: 'Dummy Output',
        purchaseComments: '',
        purchaseCategory: 'General',
    },
    '2': {
        id: '2',
        requesterID: '2',
        approverID: '2',
        committeeID: '1',
        requestDate: '1639885017',
        approvalDate: '1639885018',
        completionDate: '1639885019',
        requestPrice: '10.00',
        approvalPrice: '10.00',
        completionPrice: '10.00',
        itemDescription: 'Test Item',
        itemVendor: 'Fake Vendor Inc',
        purchaseReason: 'Dummy Output',
        purchaseComments: 'This is a test purchase',
        purchaseCategory: 'General',
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

export default {
    getPurchaseByID,
    createNewPurchase,
    approvePurchase,
    completePurchase,
}
