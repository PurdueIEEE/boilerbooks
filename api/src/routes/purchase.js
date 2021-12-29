import { Router } from 'express';

const router = Router();

/*
    route: /purchase
    method: all
    behavior: default sink for all requests
    return: 405
*/
router.all('/', (req, res) => {
    return res.status(405).send({ status: 405, response:"Endpoint not allowed." });
});

/*
    route: /purchase/new
    method: post
    behavior: create a new purchase request
    return: 400, 201
*/
router.post('/new', (req, res) => {
    if (req.body.purchaserID === undefined ||
        req.body.committeeID === undefined ||
        req.body.requestPrice === undefined ||
        req.body.itemDescription === undefined ||
        req.body.itemVendor === undefined ||
        req.body.purchaseReason === undefined ||
        req.body.purchaseComments === undefined ||
        req.body.purchaseCategory === undefined) {
        return res.status(400).send({ status: 400, response:"All purchase details must be completed." });
    }

    if (req.body.purchaserID === '' ||
        req.body.committeeID === '' ||
        req.body.requestPrice === '' ||
        req.body.itemDescription === '' ||
        req.body.itemVendor === '' ||
        req.body.purchaseReason === '' ||
        req.body.purchaseComments === '' ||
        req.body.purchaseCategory === '') {
        return res.status(400).send({ status: 400, response:"All purchase details must be completed." });
    }

    const id = uuidv4();
    const date = new Date();
    const purchase = {
        id,
        purchaserID: req.body.purchaserID,
        approverID: '',
        reimburserID: '',
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
        status: req.context.models.purchase.STATUS.request,
    };

    req.context.models.purchase.createNewPurchase(id, purchase);

    return res.status(201).send({ status: 201, response:"Purchase created." });
});

/*
    route: /purchase/<id>/view
    method: get
    behavior: view purchase details for given id, only requesters/approvers/treasurers
    return: 404, 200
*/
router.get('/:purchaseID/view', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    const committee = req.context.models.committee.getCommitteeFromID(purchase.committeeID);

    if(!user.approver_permission[committee] &&
       !user.treasurer_permission &&
       purchase.purchaserID !== user.id) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    return res.status(200).send({ status: 200, response: purchase });
});

/*
    route: /purchase/<id>/approve
    method: post
    behavior: approve purchase request, only with proper approval permissions
    return: 400, 404, 201
*/
router.post('/:purchaseID/approve', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    const committee = req.context.models.committee.getCommitteeFromID(purchase.committeeID);

    if(!user.approver_permission[committee]) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    if(purchase.status !== req.context.models.purchase.STATUS.request) {
        return res.status(400).send({ status: 400, response:"Purchase not request." });
    }

    if(req.body.approverID === undefined || req.body.approverID === '' ||
       req.body.approvalPrice === undefined || req.body.approvalPrice === '') {
        return res.status(400).send({ status:400, response:"Approval details must be completed." });
    }

    const date = new Date();
    purchase.approvalDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    purchase.approverID = req.body.approverID;
    purchase.approvalPrice = req.body.approvalPrice;
    purchase.status = req.context.models.purchase.STATUS.approved;

    req.context.models.purchase.approvePurchase(purchase.id, purchase);
    return res.status(201).send({ status: 201, response:"Purchase approved." });
});

/*
    route: /purchase/<id>/complete
    method: post
    behavior: Mark purchase as completed, only requester allowed
    return: 404, 400, 201
*/
router.post('/:purchaseID/complete', (req, res) => {
    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    if(purchase.purchaserID !== req.context.request_user_id) {
        return res.status(404).send({ status: 404, response:"Purchase not found." });
    }

    if(purchase.status !== req.context.models.purchase.STATUS.approved) {
        return res.status(400).send({ status: 400, response:"Purchase not approved." });
    }

    if(req.body.completionPrice === undefined || req.body.approverID === '') {
        return res.status(400).send({ status:400, response:"Completion details must be completed." });
    }

    const date = new Date();
    purchase.completionDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    purchase.completionPrice = req.body.approvalPrice;
    purchase.status = req.context.models.purchase.STATUS.complete;

    req.context.models.purchase.completePurchase(purchase.id, purchase);
    return res.status(201).send({ status: 201, response:"Purchase completed." });
});

/*
    route: /purchase/<id>/processing
    method: post
    behavior: Move a completed purchase into reimbursement processing
    return: 400, 404, 201
*/
router.post('/:purchaseID/processing', (req, res) => {
    const user = req.context.models.user.getUserByID(req.context.models.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    if(!user.treasurer_permission) {
        return res.status(404).send({ status:404, response:"Purchase not found." });
    }

    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status:404, response:"Purchase not found." });
    }

    if(purchase !== req.context.models.purchase.STATUS.complete) {
        return res.status(400).send({ status: 400, response:"Purchase not completed." });
    }

    purchase.status = req.context.models.purchase.STATUS.processing;

    req.context.models.purchase.updatePurchaseStatus(purchase.id, purchase);
    return res.status(201).send({ status: 201, response:"Purchase processing." });
});

/*
    route: /purchase/<id>/reimburse
    method: post
    behavior: BOSO has reimbursed purchase, workflow complete
    return: 400, 404, 201
*/
router.post('/:purchaseID/reimburse', (req, res) => {
    const user = req.context.models.user.getUserByID(req.context.models.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    if(!user.treasurer_permission) {
        return res.status(404).send({ status:404, response:"Purchase not found." });
    }

    const purchase = req.context.models.purchase.getPurchaseByID(req.params.purchaseID);

    if(purchase === undefined) {
        return res.status(404).send({ status:404, response:"Purchase not found." });
    }

    if(purchase.status !== req.context.models.purchase.STATUS.complete ||
       purchase.status !== req.context.models.purchase.STATUS.processing) {
        return res.status(400).send({ status: 400, response:"Purchase not completed or processing." });
    }

    if(req.body.reimburserID === undefined || req.body.reimburserID === '') {
        return res.status(400).send({ status:400, response:"Reimbursement details must be completed." });
    }

    const date = new Date();
    purchase.reimburserID = req.body.reimburserID;
    purchase.reimbursementDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    purchase.status = req.context.models.purchase.STATUS.reimbursed;

    req.context.models.purchase.updatePurchaseStatus(purchase.id, purchase);
    return res.status(201).send({ status: 201, response:"Purchase reimbursed." });
});

export default router;
