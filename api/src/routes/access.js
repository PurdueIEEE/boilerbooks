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
import { ACCESS_LEVEL, logger } from "../common_items.js";
import { committee_id_to_display } from "../db_loaded_items.js";

const router = Router();

/*
    Get all treasurers
*/
router.get("/treasurers", async(req, res, next) => {
    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await Models.access.getTreasurers(ACCESS_LEVEL.treasurer);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all officers
*/
router.get("/officers", async(req, res, next) => {
    try {
        // first we make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await Models.access.getApprovals(ACCESS_LEVEL.officer);
        results_1.forEach((elm) => (elm.committee = committee_id_to_display[elm.committee]));
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all internal leaders
*/
router.get("/internals", async(req, res, next) => {
    try {
        // first we make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }
        const [results_1] = await Models.access.getApprovals(ACCESS_LEVEL.internal_leader);
        results_1.forEach((elm) => (elm.committee = committee_id_to_display[elm.committee]));
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Add a new treasurer
*/
router.post("/treasurers", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    if (req.body.username.length > 50) {
        res.status(400).send("Username field too long");
        return next();
    }
    if (req.body.username.role > 50) {
        res.status(400).send("Role field too long");
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Treasurer added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await Models.access.checkApprovalExists(req.body.username, "General IEEE", true);
        if (results_1[0].approvalexists) {
            res.status(400).send("User already has approval powers for General IEEE, please remove them before adding more");
            return next();
        }

        // third add user as a treasurer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: "",
            amount: 0,
            category: "*",
            level: ACCESS_LEVEL.treasurer,
        };
        for (let committee in committee_id_to_display) {
            approval.committee = committee;
            if (committee_id_to_display[committee] === "General IEEE") {
                approval.amount = 1000000; // if they need more than this we have a problem
            }
            await Models.access.addApproval(approval);
            approval.amount = 0; // reset back to 0
        }
        res.status(200).send("Treasurer added");
        return next();
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW") {
            res.status(400).send("No such user exists");
            return next();
        } else {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    }
});

/*
    Add a new officer
*/
router.post("/officers", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee == "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    if (committee_id_to_display[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    if (req.body.username.length > 50) {
        res.status(400).send("Username field too long");
        return next();
    }
    if (req.body.username.role > 50) {
        res.status(400).send("Role field too long");
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Officer added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await Models.access.checkApprovalExists(req.body.username, req.body.committee);
        if (results_1[0].approvalexists) {
            res.status(400).send(`User already has approval powers for ${req.body.committee}, please remove them before adding more`);
            return next();
        }

        // third add user as an officer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: req.body.committee,
            amount: 1000000, // if they need more than this we have a problem
            category: "*",
            level: ACCESS_LEVEL.officer,
        };
        await Models.access.addApproval(approval);
        res.status(200).send("Officer added");
        return next();
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW") {
            res.status(400).send("No such user exists");
            return next();
        } else {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    }
});

/*
    Add a new internal leader
*/
router.post("/internals", async(req, res, next) => {
    if (req.body.username === undefined || req.body.username === "" ||
        req.body.role === undefined || req.body.role === "" ||
        req.body.committee === undefined || req.body.committee === "" ||
        req.body.amount === undefined || req.body.amount === "") {
        res.status(400).send("Complete all addition details");
        return next();
    }

    if (req.body.committee === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    if (req.body.username.length > 50) {
        res.status(400).send("Username field too long");
        return next();
    }
    if (req.body.username.role > 50) {
        res.status(400).send("Role field too long");
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Internal Leader added"); // silently failed
            return next();
        }

        // second verify that user doesn't have approvals already
        const [results_1] = await Models.access.checkApprovalExists(req.body.username, req.body.committee);
        if (results_1[0].approvalexists) {
            res.status(400).send(`User already has approval powers for ${req.body.committee}, please remove them before adding more`);
            return next();
        }

        // third add user as an officer
        const approval = {
            username: req.body.username,
            role: req.body.role,
            committee: req.body.committee,
            amount: req.body.amount,
            category: "*",
            level: ACCESS_LEVEL.internal_leader,
        };
        await Models.access.addApproval(approval);
        res.status(200).send("Internal Leader added");
        return next();
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW") {
            res.status(400).send("No such user exists");
            return next();
        } else {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    }
});

/*
    Delete a user's permissions
*/
router.delete("/approvals/:approverID", async(req, res, next) => {
    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Access removed");
            return next();
        }
        await Models.access.removeApproval(req.params.approverID);
        res.status(200).send("Access removed");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Delete a treasurer
*/
router.delete("/treasurer/:username", async(req, res, next) => {
    try {
        // first make sure user is actually a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Access removed");
            return next();
        }
        await Models.access.removeTreasurer(req.params.username);
        res.status(200).send("Access removed");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
