import { Router } from "express";
import { fiscal_year_list, current_fiscal_year, committee_lut, ACCESS_LEVEL, logger } from "../common_items";

const router = Router();

/*
    Get a list of all fiscal years
*/
router.get("/years", (req, res) => {
    return res.status(200).send(fiscal_year_list);
});

/*
    Create a new budget for the current fiscal year
*/
router.post("/:comm", async(req, res) => {
    if (!(req.params.comm in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.body === undefined || req.body.length === 0) {
        return res.status(400).send("No budget items included");
    }

    // First check the user has approval permissions
    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.comm][0], ACCESS_LEVEL.officer);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    // Clear the old budget from the database
    try {
        const [results, fields] = await req.context.models.budgets.clearBudget(committee_lut[req.params.comm][0], current_fiscal_year);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    // Add all the new line items
    try {
        for (let item of req.body) {
            if (item.category === undefined || item.amount === undefined) {
                return res.status(400).send("Budget item(s) not complete");
            }
            if (item.category === "" || item.amount === "") {
                return res.status(400).send("Budget item(s) not complete");
            }

            let budget = {
                category: item.category,
                amount: item.amount,
                committee: committee_lut[req.params.comm][0],
                year: current_fiscal_year,
            };

            const [results, fields] = await req.context.models.budgets.addBudget(budget);
        }
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    return res.status(201).send("Budget submitted for approval");
});

/*
    Update the committee budget to approved
*/
router.put("/:comm", async(req, res) => {
    if (!(req.params.comm in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        // first we make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Approved Budget");
        }

        const [results_1, fields_1] = await req.context.models.budgets.approveCommitteeBudget(committee_lut[req.params.comm][0], current_fiscal_year);

        return res.status(200).send("Approved Budget");

    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get all the submitted committee budgets
*/
router.get("/submitted", async(req, res) => {
    try {
        // first we make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send({});
        }

        const budgets = {};

        for (let committee in committee_lut) {
            const [results_1, fields_1] = await req.context.models.budgets.getCommitteeSubmittedBudget(committee_lut[committee][0], current_fiscal_year);
            budgets[committee] = results_1;
        }

        return res.status(200).send(budgets);

    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
