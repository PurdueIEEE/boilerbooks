import { Router } from "express";
import { committee_name_swap, logger } from "../common_items";

const router = Router();

router.post("/", async(req, res) => {
    if (req.body.committee === undefined ||
        req.body.source === undefined ||
        req.body.amount === undefined ||
        req.body.item === undefined ||
        req.body.type === undefined ||
        req.body.status === undefined ||
        req.body.comments === undefined) {
        return res.status(400).send("All donation details must be completed");
    }

    if (req.body.committee === "" ||
        req.body.source === "" ||
        req.body.amount === "" ||
        req.body.type === "" ||
        req.body.status === "") {
        return res.status(400).send("All donation details must be completed");
    }

    // can't escape committee so check committee name first
    if (committee_name_swap[req.body.committee] === undefined) {
        return res.status(400).send("Committee must be proper value");
    }

    // can't escape type, so check it first
    if (req.body.type !== "BOSO" && req.body.type !== "Cash" && req.body.type !== "Discount" && req.body.type !== "SOGA") {
        return res.status(400).send("Type must be proper value");
    }

    // can't escape status so check it first
    if (req.body.status !== "Expected" && req.body.status !== "Received" && req.body.status !== "Unreceived") {
        return res.status(400).send("Status must be proper value");
    }

    // if donation coming through BOSO, it's not actually recieved
    if (req.body.type === "BOSO" && req.body.status === "Received") {
        req.body.status = "Expected";
    }

    // Make sure user actually is allowed to create donations
    try {
        const [results, ] = await req.context.models.account.getUserApprovals(req.context.request_user_id, req.body.committee);
        if (results.length === 0) {
            return res.status(403).send("Not allowed to create donation"); // silently fail
        }
    } catch (err) {
        logger.error(err.stack);
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
        const [results, ] = await req.context.models.income.createNewDonation(donation);
        if (results.affectedRows === 0) {
            return res.status(400).send("Donation cannot be created, try again later");
        }
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    return res.status(201).send("Donation created");
});

router.get("/", async(req, res) => {
    // Check that user is treasurer
    try {
        const [results, ] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(404).send("Income not found");
        }
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, ] = await req.context.models.income.getAllIncome();
        results.forEach(income => {
            income.committee = committee_name_swap[income.committee];
        });
        return res.status(200).send(results);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.put("/:incomeID", async(req, res) => {
    if (req.body.status === undefined ||
        req.body.refnumber === undefined) {
        return res.status(400).send("All income update details must be completed");
    }

    if (req.body.status !== "Expected" && req.body.status !== "Received" && req.body.status !== "Unreceived") {
        return res.status(400).send("Status must be 'Expected', 'Received', or 'Unreceived'");
    }

    // Check that user is treasurer
    try {
        const [results, ] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(404).send("Income not found");
        }
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    const income = {
        refnumber: req.body.refnumber,
        status: req.body.status,
        id: req.params.incomeID,
    };

    try {
        await req.context.models.income.updateIncome(income);
        return res.status(200).send("Income updated");
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
