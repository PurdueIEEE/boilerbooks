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

import Models from "../models/index.js";
import { fiscal_year_list, current_fiscal_year, ACCESS_LEVEL, fiscal_year_lut } from "../common_items.js";
import { logger } from "../utils/logging.js";
import { committee_id_to_display } from "../db_loaded_items.js";

const router = Router();

/*
    Get a list of all committees
*/
router.get("/", (req, res, next) => {
    // literally just gets a list of committees
    res.status(200).send(committee_id_to_display);
    return next();
});

/*
    Get a list of all committee budget categories for the current year
*/
router.get("/:commID/categories/:year?", async(req, res, next) => {
    // commKey must be one of the above values, that is in the DB
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.committee.getCommitteeCategories(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    try {
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeBalance(req.params.commID);
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get total committee credit level
*/
router.get("/:commID/credit", async(req, res, next) => {
    if (!(req.params.commID in committee_id_to_display)) {
        res.status(404).send("Invalid committee value");
        return next();
    }

    try {
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeCredit(req.params.commID);
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
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeBudgetTotals(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeExpenseTotals(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeIncomeTotals(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteePurchases(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeIncome(req.params.commID, fiscal_year_lut[req.params.year]);
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
    if (!(req.params.commID in committee_id_to_display)) {
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

    if (req.query.INSGC === undefined) {
        req.query.INSGC = "false";
    }

    try {
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteeBudgetSummary(req.params.commID, fiscal_year_lut[req.params.year], req.query.INSGC === "true");
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/* Internal Helper Function */
function cleanCSVEntry(text) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
}

/*
    Get a CSV file of all purchases for a given year
*/
router.get("/:commID/csv", async(req, res, next) => {
    if (!(req.params.commID in committee_id_to_display)) {
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
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.params.commID, ACCESS_LEVEL.internal_leader);
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
        const [results] = await Models.committee.getCommitteePurchasesByDates(req.params.commID, req.query.start, req.query.end);
        let csvString = "Purchase ID,Date,Purchaser,Item,Vendor,Cost,Reason,Comments\n";

        for (let purchase of results) {
            csvString += `"${purchase.purchaseid}","${purchase.date}",${cleanCSVEntry(purchase.pby)},${cleanCSVEntry(purchase.item)},${cleanCSVEntry(purchase.vendor)},${purchase.cost},${cleanCSVEntry(purchase.purchasereason)},${cleanCSVEntry(purchase.comments)}\n`;
        }

        res.status(200).attachment(`${committee_id_to_display[req.params.commID].split(" ").join("_")}_${req.query.start}_${req.query.end}.csv`).send(csvString);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
