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
import { ACCESS_LEVEL } from "../common_items.js";

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

        const [results_0] = await Models.infra.addNewCommittee(req.body);

        // Add permissions for all the treasurers, only if the banking status is valid
        if (req.body.bank_status !== "Inactive") {
            const [list_of_treasurers] = await Models.access.getTreasurers(ACCESS_LEVEL.treasurer);
            for (const treas of list_of_treasurers) {
                const approval = {
                    username: treas.username,
                    role: treas.role,
                    amount: 0,
                    category: "*",
                    level: ACCESS_LEVEL.treasurer,
                    committee: results_0.insertId,
                };

                await Models.access.addApproval(approval);
            }
        }

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
        if (res.headersSent === false) {
            res.status(500).send("Internal Server Error");
        }
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

        // IMPORTANT: if the committee bank_status changed to 'Inactive', new treasurers will not
        //  be added to it. This includes when the status is changed back to 'Active'.
        // Since we warn the user that changing to 'Inactive' is a destructive action, I'm not
        //  too concerned, but this may be an issue we want to revisit.
        // Further, changing to 'Inactive' does not remove permissions for existing treasurers.
        // Again, we told the user things would get wonky, but is a known issue. For future search:
        // TODO fix permissions when bank_status is changed with 'Inactive'

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
        if (res.headersSent === false) {
            res.status(500).send("Internal Server Error");
        }
        return next();
    }
});

export default router;
