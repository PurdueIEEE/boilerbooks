import { Router } from "express";

const router = Router();

import { committee_lut, fiscal_year_list, current_fiscal_year, logger } from "../common_items";

/*
    Get a list of all committees
*/
router.get("/", (req, res, next) => {
    // literally just gets a list of committees
    res.status(200).send(committee_lut);
    return next();
});

/*
    Get a list of all committee budget categories for the current year
*/
router.get("/:commID/categories", async(req, res, next) => {
    // commKey must be one of the above values, that is in the DB
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeCategories(committee_lut[req.params.commID][0]);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }


});

/*
    Get total committee balance
*/
router.get("/:commID/balance", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeBalance(committee_lut[req.params.commID][0]);
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get committee budget for a year
*/
router.get("/:commID/budget/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeBudgetTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get total expenses for a committee for a year
*/
router.get("/:commID/expensetotal/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeExpenseTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get total income for a committee for a year
*/
router.get("/:commID/incometotal/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeIncomeTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all purchases for a committee for a year
*/
router.get("/:commID/purchases/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteePurchases(committee_lut[req.params.commID][0], req.params.year);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all income for a committee for a year
*/
router.get("/:commID/income/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeIncome(committee_lut[req.params.commID][0], req.params.year);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get financial summary for a committee for a year
*/
router.get("/:commID/summary/:year?", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            res.status(404).send("Invalid committee value");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.committee.getCommitteeBudgetSummary(committee_lut[req.params.commID][0], req.params.year);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
