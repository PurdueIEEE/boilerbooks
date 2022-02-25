import { Router } from "express";
import { fiscal_year_list, current_fiscal_year, committee_lut, ACCESS_LEVEL, logger } from "../common_items";

const router = Router();

/*
    Get a list of all fiscal years
*/
router.get("/years", (req, res, next) => {
    res.status(200).send(fiscal_year_list);
    return next();
});

/*
    Create a new budget for the current fiscal year
*/
router.post("/:comm", async(req, res, next) => {
    if (!(req.params.comm in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.body === undefined || req.body.length === 0) {
        res.status(400).send("No budget items included");
        return next();
    }

    // First check the user has approval permissions
    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.comm][0], ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    // Clear the old budget from the database
    try {
        await req.context.models.budgets.clearBudget(committee_lut[req.params.comm][0], current_fiscal_year);
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    // Add all the new line items
    try {
        for (let item of req.body) {
            if (item.category === undefined || item.amount === undefined) {
                res.status(400).send("Budget item(s) not complete");
                return next();
            }
            if (item.category === "" || item.amount === "") {
                res.status(400).send("Budget item(s) not complete");
                return next();
            }

            let budget = {
                category: item.category,
                amount: item.amount,
                committee: committee_lut[req.params.comm][0],
                year: current_fiscal_year,
            };

            await req.context.models.budgets.addBudget(budget);
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Budget submitted for approval");
    return next();
});

/*
    Update the committee budget to approved
*/
router.put("/:comm", async(req, res, next) => {
    if (!(req.params.comm in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    try {
        // first we make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Approved Budget");
            return next();
        }

        await req.context.models.budgets.approveCommitteeBudget(committee_lut[req.params.comm][0], current_fiscal_year);

        res.status(200).send("Approved Budget");
        return next();

    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all the submitted committee budgets
*/
router.get("/submitted", async(req, res, next) => {
    try {
        // first we make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send({});
            return next();
        }

        const budgets = {};

        for (let committee in committee_lut) {
            const [results_1] = await req.context.models.budgets.getCommitteeSubmittedBudget(committee_lut[committee][0], current_fiscal_year);
            budgets[committee] = results_1;
        }

        res.status(200).send(budgets);
        return next();

    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
