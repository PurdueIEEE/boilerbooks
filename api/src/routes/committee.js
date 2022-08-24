/*
   Copyright 2022 Purdue IEEE and Hadi Ahmed

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { Router } from "express";

const router = Router();

import { committee_lut, fiscal_year_list, current_fiscal_year, logger, ACCESS_LEVEL, fiscal_year_lut } from "../common_items.js";

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
router.get("/:commID/categories/:year?", async(req, res, next) => {
    // commKey must be one of the above values, that is in the DB
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
        const [results] = await req.context.models.committee.getCommitteeCategories(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteeBudgetTotals(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteeExpenseTotals(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteeIncomeTotals(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteePurchases(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteeIncome(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
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
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteeBudgetSummary(committee_lut[req.params.commID][0], fiscal_year_lut[req.params.year]);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a CSV file of all purchases for a given year
*/
router.get("/:commID/csv", async(req, res, next) => {
    if (!(req.params.commID in committee_lut)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    if (req.query.start === undefined) {
        req.query.start = `${current_fiscal_year.split("-")[0]}-08-01`;
    }

    if (req.query.end === undefined) {
        req.query.end = `${current_fiscal_year.split("-")[1]}-08-01`;
    }

    if ((req.query.start.match(/^\d{4}-\d{2}-\d{2}$/)).length === 0) {
        res.status(400).send("Start date must be in the form YYYY-MM-DD");
        return next();
    }

    if ((req.query.end.match(/^\d{4}-\d{2}-\d{2}$/)).length === 0) {
        res.status(400).send("End date must be in the form YYYY-MM-DD");
        return next();
    }

    if (req.query.end < req.query.start) {
        res.status(400).send("Start date must be less than the end date");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.commID][0], ACCESS_LEVEL.internal_leader);
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
        const [results] = await req.context.models.committee.getCommitteePurchasesByDates(committee_lut[req.params.commID][0], req.query.start, req.query.end);
        let csvString = "Purchase ID,Date,Purchaser,Item,Vendor,Cost,Reason\n";

        for (let purchase of results) {
            csvString += `"${purchase.purchaseid}","${purchase.date}","${purchase.pby.replaceAll("\"", "\"\"")}","${purchase.item.replaceAll("\"", "\"\"")}","${purchase.vendor.replaceAll("\"", "\"\"")}","${purchase.cost.replaceAll("\"", "\"\"")}","${purchase.purchasereason.replaceAll("\"", "\"\"")}"\n`;
        }

        res.status(200).attachment(`${req.params.commID}_${req.query.start}_${req.query.end}.csv`).send(csvString);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
