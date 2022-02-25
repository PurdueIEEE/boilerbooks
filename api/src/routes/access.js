import { Router } from "express";
import { ACCESS_LEVEL, committee_name_swap, logger } from "../common_items";

const router = Router();

router.get("/treasurers", async(req, res, next) => {
    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await req.context.models.access.getTreasurers(ACCESS_LEVEL.treasurer);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.get("/officers", async(req, res, next) => {
    try {
        // first we make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await req.context.models.access.getApprovals(ACCESS_LEVEL.officer);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.get("/internals", async(req, res, next) => {
    try {
        // first we make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await req.context.models.access.getApprovals(ACCESS_LEVEL.internal_leader);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.post("/treasurers", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Treasurer added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            res.status(400).send("User already has approval powers, please remove them before adding more");
            return next();
        }

        // third add user as a treasurer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: "",
            amount: 0,
            category: "*",
            level: ACCESS_LEVEL.treasurer,
        };
        for (let committee in committee_name_swap) {
            approval.committee = committee;
            if (committee === "General IEEE") {
                approval.amount = 1000000; // if they need more than this we have a problem
            }
            await req.context.models.access.addApproval(approval);
            if (committee === "General IEEE") {
                approval.amount = 0; // reset back to 0
            }
        }
        res.status(200).send("Treasurer added");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.post("/officers", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee == "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    if (committee_name_swap[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Officer added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            res.status(400).send("User already has approval powers, please remove them before adding more");
            return next();
        }

        // third add user as an officer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: req.body.committee,
            amount: 1000000, // if they need more than this we have a problem
            category: "*",
            level: ACCESS_LEVEL.officer,
        };
        await req.context.models.access.addApproval(approval);
        res.status(200).send("Officer added");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.post("/internals", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee === "" ||
        req.body.amount === undefined || req.body.amount === "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    if (committee_name_swap[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Internal Leader added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            res.status(400).send("User already has approval powers, please remove them before adding more");
            return next();
        }

        // third add user as an officer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: req.body.committee,
            amount: req.body.amount,
            category: "*",
            level: ACCESS_LEVEL.internal_leader,
        };
        await req.context.models.access.addApproval(approval);
        res.status(200).send("Internal Leader added");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.delete("/approvals/:approver", async(req, res, next) => {
    if (req.params.approver === "") { // Sanity Check
        res.status(400).send("Bad Treasurer ID");
        return next();
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Access removed");
            return next();
        }
        await req.context.models.access.removeApproval(req.params.approver);
        res.status(200).send("Access removed");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
