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

import crypto from "crypto";

const router = Router();

import { ACCESS_LEVEL, current_fiscal_year, dues_committees, logger } from "../common_items.js";

/*
    Get a list of all dues committees
*/
router.get("/committees", (req, res, next) => {
    // literally just gets a list of committees
    res.status(200).send(dues_committees);
    return next();
});

/*
    Create a new dues member
*/
router.post("/", async(req, res, next) => {
    if (req.body.name === undefined ||
        req.body.email === undefined ||
        req.body.puid === undefined ||
        req.body.committees === undefined) {
        res.status(400).send("Dues details must be completed");
        return next();
    }

    if (req.body.name === '' ||
        req.body.email === '') {
        res.status(400).send("Dues details must be completed");
        return next();
    }

    if (typeof(req.body.committees) !== "object" ||
        req.body.committees.length === 0) {
        res.status(400).send("Member must be in at least one committee");
        return next();
    }

    if (req.body.puid.length > 0 && !(/^00[0-9]{8}$/.test(req.body.puid))) {
        res.status(400).send("PUID must be 10 digits padded with 0s");
        return next();
    }

    // validate each committee we are trying to add actually exists
    for (let comm of req.body.committees) {
        if (!dues_committees.includes(comm)) {
            res.status(400).send("Invalid committee value");
            return next();
        }
    }

    try {
        // first make sure user is actually a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]);
            return next();
        }

        const [results_1] = await req.context.models.dues.getMemberByEmail(req.body.email, current_fiscal_year);
        if (results_1.length) {
            // 409 is an unusual status code but sort of applies here?
            res.status(409).send("Member email already exists");
            return next();
        }

        req.body.committees = req.body.committees.join(",")
        if (req.body.puid.length > 0)
            req.body.puid = crypto.createHash('sha512').update(req.body.puid).digest('hex');

        await req.context.models.dues.createNewMember(req.body);

    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Member added!");
    return next();
});

/*
    View total counts of dues members for a committee
*/
router.get("/summary/:year?", async(req, res, next) => {
    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    try {
        // first make sure user is actually an officer
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, '%', ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(200).send({});
            return next();
        }

        const [results_1] = await req.context.models.dues.getDuesMembers(req.params.year);
        const resp_obj = dues_committees.reduce((out, elm) => (out[elm]=0, out), {});
        results_1.forEach(dues => {
            dues.committee.split(/(?:, |,)+/).forEach(comm => {
                if (comm === "None" && resp_obj[comm] == undefined) {
                    resp_obj[comm] = 0; // Handle case where committee is 'None'
                }
                resp_obj[comm] += 1;
            });
        });

        res.status(200).send(resp_obj);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get all members for a year
*/
router.get("/all/:year?", async(req, res, next) => {
    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year;
    }

    try {
        // first make sure user is actually an officer
        const [results] = await req.context.models.account.getUserApprovals(req.context.request_user_id, '%', ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(200).send([]);
            return next();
        }

        const [results_1] = await req.context.models.dues.getDuesMembers(req.params.year);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
