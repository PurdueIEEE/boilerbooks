import { Router } from "express";

const router = Router();

import { committee_lut, fiscal_year_list, current_fiscal_year } from "../common_items";

/*
    Get a list of all committees
*/
router.get("/", (req, res) => {
    // literally just gets a list of committees
    return res.status(200).send(committee_lut);
});

/*
    Get a list of all committee budget categories for the current year
*/
router.get("/:commID/categories", async(req, res) => {
    // commKey must be one of the above values, that is in the DB
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeCategories(committee_lut[req.params.commID][0]);
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }


});

/*
    Get total committee balance
*/
router.get("/:commID/balance", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeBalance(committee_lut[req.params.commID][0]);
        return res.status(200).send(results[0]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get committee budget for a year
*/
router.get("/:commID/budget/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeBudgetTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
        return res.status(200).send(results[0]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get total expenses for a committee for a year
*/
router.get("/:commID/expensetotal/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeExpenseTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
        return res.status(200).send(results[0]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get total income for a committee for a year
*/
router.get("/:commID/incometotal/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeIncomeTotals(committee_lut[req.params.commID][0], req.params.year);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
        return res.status(200).send(results[0]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get all purchases for a committee for a year
*/
router.get("/:commID/purchases/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteePurchases(committee_lut[req.params.commID][0], req.params.year);
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get all income for a committee for a year
*/
router.get("/:commID/income/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeIncome(committee_lut[req.params.commID][0], req.params.year);
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

/*
    Get financial summary for a committee for a year
*/
router.get("/:commID/summary/:year?", async(req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    if (!(fiscal_year_list.includes(req.params.year))) {
        return res.status(404).send("Invalid fiscal year");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeBudgetSummary(committee_lut[req.params.commID][0], req.params.year);
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
