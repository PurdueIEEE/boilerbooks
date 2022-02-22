import { Router } from "express";
import { ACCESS_LEVEL, committee_name_swap, logger } from "../common_items";

const router = Router();

router.get("/treasurers", async(req, res) => {
    try {
        // first make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send([]);
        }
        const [results_1, _] = await req.context.models.access.getTreasurers(ACCESS_LEVEL.treasurer);
        return res.status(200).send(results_1);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/officers", async(req, res) => {
    try {
        // first we make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send([]);
        }
        const [results_1, _] = await req.context.models.access.getApprovals(ACCESS_LEVEL.officer);
        return res.status(200).send(results_1);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/internals", async(req, res) => {
    try {
        // first we make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send([]);
        }
        const [results_1, _] = await req.context.models.access.getApprovals(ACCESS_LEVEL.internal_leader);
        return res.status(200).send(results_1);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/treasurers", async(req, res) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "") {
        return res.status(400).send("Complete all addition details");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Treasurer added"); // silently failed
        }

        // second verify that user doesn't have approvals already
        const [results_1, _] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            return res.status(400).send("User already has approval powers, please remove them before adding more");
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
        return res.status(200).send("Treasurer added");
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/officers", async(req, res) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee == "") {
        return res.status(400).send("Complete all addition details");
    }

    if (committee_name_swap[req.body.committee] === undefined) {
        return res.status(400).send("Committee must be proper value");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Officer added"); // silently failed
        }

        // second verify that user doesn't have approvals already
        const [results_1, _] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            return res.status(400).send("User already has approval powers, please remove them before adding more");
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
        return res.status(200).send("Officer added");
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/internals", async(req, res) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee === "" ||
        req.body.amount === undefined || req.body.amount === "") {
        return res.status(400).send("Complete all addition details");
    }

    if (committee_name_swap[req.body.committee] === undefined) {
        return res.status(400).send("Committee must be proper value");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Internal Leader added"); // silently failed
        }

        // second verify that user doesn't have approvals already
        const [results_1, _] = await req.context.models.access.checkApprovalExists(req.body.username);
        if (results_1[0].approvalexists) {
            return res.status(400).send("User already has approval powers, please remove them before adding more");
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
        return res.status(200).send("Internal Leader added");
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/approvals/:approver", async(req, res) => {
    if (req.params.approver === "") { // Sanity Check
        return res.status(400).send("Bad Treasurer ID");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, _] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Access removed");
        }
        await req.context.models.access.removeApproval(req.params.approver);
        return res.status(200).send("Access removed");
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
