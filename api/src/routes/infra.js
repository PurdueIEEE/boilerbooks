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
import { logger } from "../utils/logging.js";
import loader from "../utils/committees.js";

const router = Router();

const bank_statuses = ["Active", "Inactive", "Read-Only"];
const dues_statuses = ["Active", "Inactive"];

router.get("/committees", async(req, res, next) => {
    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }

        const [results_1] = await Models.infra.getAllCommittees();
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.post("/committees", async(req, res, next) => {
    if (req.body.display_name === undefined || req.body.display_name === "" ||
        req.body.api_name === undefined || req.body.api_name === "" ||
        req.body.bank_status === undefined || req.body.bank_status === "" ||
        req.body.dues_status === undefined || req.body.dues_status === "") {
        res.status(400).send("All fields must be filled out");
        return next();
    }

    if (!bank_statuses.includes(req.body.bank_status)) {
        res.status(400).send("Bank Status must be valid status");
        return next();
    }

    if (!dues_statuses.includes(req.body.dues_status)) {
        res.status(400).send("Dues Status must be valid status");
        return next();
    }

    if (req.body.display_name.length > 20) {
        res.status(400).send("Display Name must be <= 20 characters");
        return next();
    }

    if (req.body.api_name.length > 20) {
        res.status(400).send("API Name must be <= 20 characters");
        return next();
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }

        await Models.infra.addNewCommittee(req.body);
        res.status(200).send("Saved committee details");

        // Make sure we grab the newest fields
        const load_status = await loader.update();
        if (load_status) {
            logger.info("Committee loader updated successfully");
        } else {
            logger.error("Committee loader failed to updated");
        }


        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

router.put("/committees/:commID", async(req, res, next) => {
    if (req.body.display_name === undefined || req.body.display_name === "" ||
        req.body.api_name === undefined || req.body.api_name === "" ||
        req.body.bank_status === undefined || req.body.bank_status === "" ||
        req.body.dues_status === undefined || req.body.dues_status === "") {
        res.status(400).send("All fields must be filled out");
        return next();
    }

    if (!bank_statuses.includes(req.body.bank_status)) {
        res.status(400).send("Bank Status must be valid status");
        return next();
    }

    if (!dues_statuses.includes(req.body.dues_status)) {
        res.status(400).send("Dues Status must be valid status");
        return next();
    }

    if (req.body.display_name.length > 20) {
        res.status(400).send("Display Name must be <= 20 characters");
        return next();
    }

    if (req.body.api_name.length > 20) {
        res.status(400).send("API Name must be <= 20 characters");
        return next();
    }

    try {
        // Validate committee ID (no global list exists like elsewhere)
        const [results_0] = await Models.infra.getCommitteeByID(req.params.commID);
        if (results_0.length === 0) {
            res.status(400).send("Committee ID invalid");
            return next();
        }

        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }

        await Models.infra.updateCommitteeDetails(req.params.commID, req.body);
        res.status(200).send("Saved committee details");

        // Make sure we grab the newest fields
        const load_status = await loader.update();
        if (load_status) {
            logger.info("Committee loader updated successfully");
        } else {
            logger.error("Committee loader failed to updated");
        }

        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
