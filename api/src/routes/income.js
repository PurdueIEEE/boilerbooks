import { Router } from "express";
import { committee_name_swap, clean_input_encodeurl } from "../common_items";

const router = Router();

router.post('/', async (req, res) => {
    if (req.body.committee === undefined ||
        req.body.source === undefined ||
        req.body.amount === undefined ||
        req.body.item === undefined ||
        req.body.type === undefined ||
        req.body.status === undefined ||
        req.body.comments === undefined) {
        return res.status(400).send("All donation details must be completed");
    }

    if (req.body.committee === '' ||
        req.body.source === '' ||
        req.body.amount === '' ||
        req.body.type === '' ||
        req.body.status === '') {
        return res.status(400).send("All donation details must be completed");
    }

    // escape user input
    req.body.source = clean_input_encodeurl(req.body.source);
    req.body.amount = clean_input_encodeurl(req.body.amount);
    req.body.comments = clean_input_encodeurl(req.body.comments);
    req.body.item = clean_input_encodeurl(req.body.item);

    // can't escape committee so check committee name first
    if(committee_name_swap[req.body.committee] === undefined) {
        return res.status(400).send("Committee must be proper value");
    }

    // can't escape type, so check it first
    if (req.body.type !== 'BOSO' && req.body.type !== 'Cash' && req.body.type !== 'Discount' && req.body.type !== 'SOGA') {
        return res.status(400).send("Type must be proper value");
    }

    // can't escape status so check it first
    if (req.body.status !== 'Expected' && req.body.status !== 'Received' && req.body.status !== 'Unreceived') {
        return res.status(400).send("Status must be proper value");
    }

    // if donation coming through BOSO, it's not actually recieved
    if (req.body.type === 'BOSO' && req.body.status === 'Received') {
        req.body.status = "Expected";
    }

    // Make sure user actually is allowed to create donations
    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, req.body.committee);
        if (results.length === 0) {
            return res.status(201).send("Donation created"); // silently fail
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    const donation = {
        committee: req.body.committee,
        source: req.body.source,
        amount: req.body.amount,
        item: req.body.item,
        type: req.body.type,
        status: req.body.status,
        comments: req.body.comments,
        user: req.context.request_user_id,
    };

    try {
        const [results, fields] = await req.context.models.income.createNewDonation(donation);
        if (results.affectedRows === 0) {
            return res.status(400).send("Donation cannot be created, try again later");
        }
    } catch (err) {
        //console.log(err.stack);
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }

    return res.status(201).send("Donation created");
});

export default router;
