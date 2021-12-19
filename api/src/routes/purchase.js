import { Router } from 'express';

const router = Router();

router.all('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

router.post('/new', (req, res) => {
    if (req.body.userID === undefined ||
        req.body.committeeID === undefined ||
        req.body.requestPrice === undefined ||
        req.body.itemDescription === undefined ||
        req.body.itemVendor === undefined ||
        req.body.purchaseReason === undefined ||
        req.body.purchaseComments === undefined ||
        req.body.purchaseCategory === undefined) {
        return res.status(400).send({ status: 400, response: "All purchase details must be completed." });
    }

    if (req.body.userID === '' ||
        req.body.committeeID === '' ||
        req.body.requestPrice === '' ||
        req.body.itemDescription === '' ||
        req.body.itemVendor === '' ||
        req.body.purchaseReason === '' ||
        req.body.purchaseComments === '' ||
        req.body.purchaseCategory === '') {
        return res.status(400).send({ status: 400, response: "All purchase details must be completed." });
    }

    const id = uuidv4();
    const date = new Date();
    const purchase = {
        id,
        userID: req.body.userID,
        approverID: '',
        committeeID: req.body.committeeID,
        requestDate: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        approvalDate: '',
        completionDate: '',
        requestPrice: req.body.requestPrice,
        approvalPrice: '',
        completionPrice: '',
        itemDescription: req.body.itemDescription,
        itemVendor: req.body.itemVendor,
        purchaseReason: req.body.purchaseReason,
        purchaseComments: req.body.purchaseComments,
        purchaseCategory: req.body.purchaseCategory,
    };

    req.context.models.purchase.createNewPurchase(id, purchase);

    return res.status(201).send({ status: 201, response: "Purchase created." });
});

router.get('/:purchaseID/view', (req, res) => {
    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response: "Purchase not found." });
    }

    return res.status(200).send({ status: 200, response: purchase });
});

router.post('/:purchaseID/approve', (req, res) => {
    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response: "Purchase not found." });
    }

    const date = new Date();
    purchase.approvalDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    purchase.approverID = req.body.approverID;
    purchase.approvalPrice = req.body.approvalPrice;

    req.context.models.purchase.approvePurchase(purchase.id, purchase);
});

router.post('/:purchaseID/complete', (req, res) => {
    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response: "Purchase not found." });
    }

    const date = new Date();
    purchase.completionDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    purchase.completionPrice = req.body.approvalPrice;

    req.context.models.purchase.completePurchase(purchase.id, purchase);
});

export default router;
