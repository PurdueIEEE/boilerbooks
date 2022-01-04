import { Router } from 'express';

const router = Router();

router.post('/new', async (req, res) => {
    if (req.body.committee === undefined ||
        req.body.price === undefined ||
        req.body.item === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.comments === undefined ||
        req.body.category === undefined) {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.committee === '' ||
        req.body.price === '' ||
        req.body.item === '' ||
        req.body.vendor === '' ||
        req.body.reason === '' ||
        req.body.comments === '' ||
        req.body.category === '') {
        return res.status(400).send("All purchase details must be completed");
    }

    // TODO sanitize input here

    const purchase = {
        user: req.context.request_user_id,
        committee: req.body.committee,
        price: req.body.price,
        item: req.body.item,
        vendor: req.body.vendor,
        reason: req.body.reason,
        comments: req.body.comments,
        category: req.body.category,
    };

    /** Create the purchase request **/
    try {
        const [results, fields] = await req.context.models.purchase.createNewPurchase(purchase);
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    /** Get names of approvers and send back to user **/
    return res.status(201).send("Purchase request submitted, approval email not send");

    /** Send an email to approvers **/

});

router.get('/:purchaseID', async (req, res) => {

    /** get the basic params to check access control **/
    try {
        const [results, fields] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // No purchase found
        if (results.length === 0) {
            return res.status(404).send("Purchase not found");
        }

        // User is purchaser
        if (req.context.request_user_id === results[0].username) {
            return res.status(200).send(results[0]);
        }

        const [results_1, fields_1] = await req.context.models.account.getUserApprovals(req.context.request_user_id, results[0].committee);

        // No approval powers for committee
        if (results_1.length === 0) {
            return res.status(404).send("Purchase not found");
        }

        // Approval powers found
        return res.status(200).send(results[0]);

    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

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

router.post('/:purchaseID/processing', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

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

router.post('/:purchaseID/reimburse', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

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
