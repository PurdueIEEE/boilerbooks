import { Router } from "express";

const router = Router();

import { committee_lut, unescape_object } from '../common_items';

router.get('/', (req, res) => {
    // literally just gets a list of committees
    return res.status(200).send(committee_lut);
});

router.get('/:commKey/categories', async (req, res) => {
    // commKey must be one of the above values, that is in the DB
    if(!(req.params.commKey in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeCategories(committee_lut[req.params.commKey][0]);
        results.forEach(category => {
            category = unescape_object(category);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }


});

router.get('/:commID/purchases', (req, res) => {
    return res.status(200).send("TODO eventually");
});

router.get('/:commID/balance', async (req, res) => {
    if (!(req.params.commKey in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commKey][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeBalance(committee_lut[req.params.commKey][0]);
        console.log(results);
        return res.send(200).send(results[0]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router
