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
import { ACCESS_LEVEL } from "../common_items.js";
import { logger } from "../utils/logging.js";
import { committee_id_to_display, committee_id_to_display_readonly_included } from "../utils/committees.js";
import { fiscal_year_id_to_display } from "../utils/fiscal_year.js";

const router = Router();

const new_type = ["BOSO", "Cash", "Discount", "SOGA", "Item", "INSGC"];
const new_status = ["Expected", "Received", "Unreceived","Credit"];


router.post("/", async(req, res, next) => {
    if (req.body.committee === undefined ||
        req.body.source === undefined ||
        req.body.amount === undefined ||
        req.body.type === undefined ||
        req.body.status === undefined ||
        req.body.comments === undefined) {
        res.status(400).send("All details must be completed");
        return next();
    }

    if (req.body.committee === "" ||
        req.body.source === "" ||
        req.body.amount === "" ||
        req.body.type === "" ||
        req.body.status === "") {
        res.status(400).send("All details must be completed");
        return next();
    }

    // can't escape status so check it first
    if (!new_status.includes(req.body.status)) {
        res.status(400).send("Status must be proper value");
        return next();
    }

    if (req.body.item === undefined && req.body.status === "Item") {
        res.status(400).send("All details must be completed");
        return next();
    } else if (req.body.item === undefined) {
        req.body.item = ""; // Income doesn't have an item
    } else if (req.body.item === "") {
        res.status(400).send("Item must not be blank"); // Donations do have an item
        return next();
    }

    if (req.body.source.length > 50) {
        res.status(400).send("Source field too long");
        return next();
    }
    if (req.body.item.length > 50) {
        res.status(400).send("Item field too long");
        return next();
    }
    if (req.body.comments.length > 10000) {
        res.status(400).send("Comments field too long");
        return next();
    }

    // can't escape committee so check committee name first
    // don't check against the read-only list, no new income can be created
    if (committee_id_to_display[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    // can't escape type, so check it first
    if (!new_type.includes(req.body.type)) {
        res.status(400).send("Type must be proper value");
        return next();
    }

    // if donation coming through BOSO, it's not actually recieved
    if (req.body.type === "BOSO" && req.body.status === "Received") {
        req.body.status = "Expected";
    }

    // Make sure user actually is allowed to create donations
    try {
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, req.body.committee, ACCESS_LEVEL.internal_leader);
        if (results.length === 0) {
            res.status(403).send("Not allowed to create donation");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    // Paranoid sanity check - make sure committee is open to transactions
    // This check should never fail, it should get caught with some input validation above
    try {
        const [results] = await Models.committee.isCommitteeValidForTransactions(req.body.committee);
        if (results.length === 0) {
            res.status(403).send("Committee is not able to create income/donations");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    req.body.user = req.context.request_user_id;

    try {
        const [results] = await Models.income.createNewDonation(req.body);
        if (results.affectedRows === 0) {
            res.status(400).send("Donation cannot be created, try again later");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Donation created");
    return next();
});

router.get("/", async(req, res, next) => {
    // Check that user is treasurer
    try {
        const [results] = await Models.account.getUserTreasurerButExcludeAdmin(req.context.request_user_id);
        if (results[0].validuser === 0) {
            res.status(200).send([]);
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await Models.income.getAllIncome();
        results.forEach(income => {
            income.committee = committee_id_to_display_readonly_included[income.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.get("/:incomeID", async(req, res, next) => {
    // Make sure user actually is allowed to create donations
    try {
        const [results] = await Models.income.getIncome(req.params.incomeID);
        if (results.length === 0) {
            res.status(404).send("Income not found");
            return next();
        }
        const [results_0] = await Models.account.getUserApprovals(req.context.request_user_id, results[0].committee, ACCESS_LEVEL.internal_leader);
        if (results_0.length === 0) {
            res.status(404).send("Income not found");
            return next();
        }
        results[0].committee = committee_id_to_display_readonly_included[results[0].committee];
        results[0].fiscal_year = fiscal_year_id_to_display[results[0].fiscal_year];
        res.status(200).send(results[0]);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.put("/:incomeID", async(req, res, next) => {
    if (req.body.status === undefined ||
        req.body.refnumber === undefined ||
        req.body.refnumber === null) {
        res.status(400).send("All income update details must be completed");
        return next();
    }

    if (!new_status.includes(req.body.status)) {
        res.status(400).send("Status must be 'Expected', 'Received', 'Unreceived', or 'Credit'");
        return next();
    }

    // Check that user is treasurer
    try {
        const [results] = await Models.account.getUserTreasurerButExcludeAdmin(req.context.request_user_id);
        if (results[0].validuser === 0) {
            res.status(404).send("Income not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    const income = {
        refnumber: req.body.refnumber,
        status: req.body.status,
        id: req.params.incomeID,
    };

    try {
        await Models.income.updateIncome(income);
        res.status(200).send("Income updated");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
