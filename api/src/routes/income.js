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
import { ACCESS_LEVEL, committee_name_swap, logger } from "../common_items.js";

const router = Router();


const new_type = ["BOSO", "Cash", "Discount", "SOGA"];
const new_status = ["Expected", "Received", "Unreceived"];


router.post("/", async(req, res, next) => {
    if (req.body.committee === undefined ||
        req.body.source === undefined ||
        req.body.amount === undefined ||
        req.body.item === undefined ||
        req.body.type === undefined ||
        req.body.status === undefined ||
        req.body.comments === undefined) {
        res.status(400).send("All donation details must be completed");
        return next();
    }

    if (req.body.committee === "" ||
        req.body.source === "" ||
        req.body.amount === "" ||
        req.body.type === "" ||
        req.body.status === "") {
        res.status(400).send("All donation details must be completed");
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
    if (committee_name_swap[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    // can't escape type, so check it first
    if (!new_type.includes(req.body.type)) {
        res.status(400).send("Type must be proper value");
        return next();
    }

    // can't escape status so check it first
    if (!new_status.includes(req.body.status)) {
        res.status(400).send("Status must be proper value");
        return next();
    }

    // if donation coming through BOSO, it's not actually recieved
    if (req.body.type === "BOSO" && req.body.status === "Received") {
        req.body.status = "Expected";
    }

    // Make sure user actually is allowed to create donations
    try {
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, req.body.committee, ACCESS_LEVEL.internal_leader);
        if (results.length === 0) {
            res.status(403).send("Not allowed to create donation");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    req.body.user = req.context.request_user_id;

    try {
        const [results] = await req.context.models.income.createNewDonation(req.body);
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
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(404).send("Income not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.income.getAllIncome();
        results.forEach(income => {
            income.committee = committee_name_swap[income.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.put("/:incomeID", async(req, res, next) => {
    if (req.body.status === undefined ||
        req.body.refnumber === undefined) {
        res.status(400).send("All income update details must be completed");
        return next();
    }

    if (!new_status.includes(req.body.status)) {
        res.status(400).send("Status must be 'Expected', 'Received', or 'Unreceived'");
        return next();
    }

    // Check that user is treasurer
    try {
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
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
        await req.context.models.income.updateIncome(income);
        res.status(200).send("Income updated");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
