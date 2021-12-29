import { Router } from "express";

const router = Router();

/*
    route: /committee
    method: all
    behavior: default sink for all requests
    return: 405
*/
router.all('/', (req, res) => {
    return res.status(405).send({ status: 405, response:"Endpoint not allowed." });
});

/*
    route: /committee/<id>/purchases
    method: get
    behavior: View all purchases for a committee
    return: 400, 404, 200
*/
router.get('/:commID/purchases', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    const committee = req.context.models.committee.getCommitteeFromID(req.params.commID);

    if(committee === undefined) {
        return res.status(404).send({ status: 404, response:"Committee not found." });
    }

    if(!user.approver_permission[committee] ||
        !user.treasurer_permission) {
        return res.status(403).send({ status:403, response:"Improper view permissions" });
    }

    const purchases = req.context.models.purchase.getPurchaseByCommittee(req.params.commID);
    return res.status(200).send({ status:200, response:purchases });
});

export default router
