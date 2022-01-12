import { Router } from "express";

const router = Router();

import { committee_lut, fiscal_year_list, unescape_object } from "../common_items";

router.get("/", (req, res) => {
    // literally just gets a list of committees
    return res.status(200).send(committee_lut);
});

router.get("/:commID/categories", async (req, res) => {
    // commKey must be one of the above values, that is in the DB
    if(!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeCategories(committee_lut[req.params.commID][0]);
        results.forEach(category => {
            category = unescape_object(category);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }


});

router.get("/:commID/balance", async (req, res) => {
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

router.get("/:commID/budget/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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

router.get("/:commID/expensetotal/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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

router.get("/:commID/incometotal/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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

router.get("/:commID/purchases/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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
        results.forEach(purchase => {
            purchase = unescape_object(purchase);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/:commID/income/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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
        results.forEach(income => {
            income = unescape_object(income);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/:commID/summary/:year", async (req, res) => {
    if (!(req.params.commID in committee_lut)) {
        return res.status(404).send("Invalid committee value");
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
        results.forEach(category => {
            category = unescape_object(category);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
