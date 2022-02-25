import { Router } from "express";
import { committee_name_swap, logger } from "../common_items";

const router = Router();

router.post("/", async(req, res, next) => {
    if (req.body.committee === undefined ||
        req.body.source === undefined ||
        req.body.amount === undefined ||
        req.body.item === undefined ||
        req.body.type === undefined ||
        req.body.status === undefined ||
        req.body.comments === undefined) {
        res.status(400).send("All donation details must be completed");
        return next();
    }

    if (req.body.committee === "" ||
        req.body.source === "" ||
        req.body.amount === "" ||
        req.body.type === "" ||
        req.body.status === "") {
        res.status(400).send("All donation details must be completed");
        return next();
    }

    // can't escape committee so check committee name first
    if (committee_name_swap[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    // can't escape type, so check it first
    if (req.body.type !== "BOSO" && req.body.type !== "Cash" && req.body.type !== "Discount" && req.body.type !== "SOGA") {
        res.status(400).send("Type must be proper value");
        return next();
    }

    // can't escape status so check it first
    if (req.body.status !== "Expected" && req.body.status !== "Received" && req.body.status !== "Unreceived") {
        res.status(400).send("Status must be proper value");
        return next();
    }

    // if donation coming through BOSO, it's not actually recieved
    if (req.body.type === "BOSO" && req.body.status === "Received") {
        req.body.status = "Expected";
    }

    // Make sure user actually is allowed to create donations
    try {
        const [results, ] = await req.context.models.account.getUserApprovals(req.context.request_user_id, req.body.committee);
        if (results.length === 0) {
            res.status(403).send("Not allowed to create donation"); // silently fail
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
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
            res.status(400).send("Donation cannot be created, try again later");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Donation created");
    return next();
});

router.get("/", async(req, res, next) => {
    // Check that user is treasurer
    try {
        const [results, ] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(404).send("Income not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results, ] = await req.context.models.income.getAllIncome();
        results.forEach(income => {
            income.committee = committee_name_swap[income.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.put("/:incomeID", async(req, res, next) => {
    if (req.body.status === undefined ||
        req.body.refnumber === undefined) {
        res.status(400).send("All income update details must be completed");
        return next();
    }

    if (req.body.status !== "Expected" && req.body.status !== "Received" && req.body.status !== "Unreceived") {
        res.status(400).send("Status must be 'Expected', 'Received', or 'Unreceived'");
        return next();
    }

    // Check that user is treasurer
    try {
        const [results, ] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(404).send("Income not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    const income = {
        refnumber: req.body.refnumber,
        status: req.body.status,
        id: req.params.incomeID,
    };

    try {
        await req.context.models.income.updateIncome(income);
        res.status(200).send("Income updated");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
