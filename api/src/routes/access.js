import { Router } from "express";
import { ACCESS_LEVEL, committee_name_swap } from "../common_items";

const router = Router();

router.get("/treasurers", async (req, res) => {
    try {
        // first make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send([]);
        }
        const [results_1, fields_1] = await req.context.models.access.getTreasurers();
        return res.status(200).send(results_1);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/treasurers", async (req, res) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "") {
        return res.status(400).send("Complete all addition details");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Treasurer added"); // silently failed
        }

        // second verify that user doesn't have approvals already
        const [results_1, fields_1] = await req.context.models.access.checkApprovalExists(req.body.username);
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
            await req.context.models.access.addApproval(approval);
        }
        return res.status(200).send("Treasurer added");
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/treasurers/:treasurer", async (req, res) => {
    if (req.params.treasurer === "") { // Sanity Check
        return res.status(400).send("Bad Treasurer ID");
    }

    try {
        // first make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Treasurer removed");
        }
        const [results_1, fields_1] = await req.context.models.access.removeApproval(req.params.treasurer);
        return res.status(200).send("Treasurer removed");
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
