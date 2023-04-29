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

import Models from "../models/index.js";
import { ACCESS_LEVEL, dues_amount } from "../common_items.js";
import { current_fiscal_year_fyid, fiscal_year_id_to_display } from "../utils/fiscal_year.js";
import { logger } from "../utils/logging.js";
import { dues_committees } from "../utils/committees.js";

const router = Router();

const payment_status = ["Paid", "Exempt"];

/*
    Get a list of all dues committees
*/
router.get("/committees", (req, res, next) => {
    // literally just gets a list of committees
    res.status(200).send(dues_committees);
    return next();
});

/*
    Get all current dues amounts
*/
router.get("/amount", (req, res, next) => {
    // literally just gets a list of dues
    res.status(200).send(dues_amount);
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

    if (req.body.name === "" ||
        req.body.email === "") {
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
        if (comm === "None" && req.body.committees.length > 1) {
            res.status(400).send("'None' and another committee selected");
            return next();
        }
        if (!dues_committees.includes(comm) && comm !== "None") {
            res.status(400).send("Invalid committee value");
            return next();
        }
    }

    try {
        // first make sure user is actually an officer
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, "%", ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(200).send([]);
            return next();
        }

        const [results_1] = await Models.dues.getMemberByEmail(req.body.email, current_fiscal_year_fyid);
        if (results_1.length) {
            // 409 is an unusual status code but sort of applies here?
            res.status(409).send("Member email already exists");
            return next();
        }

        req.body.committees = req.body.committees.join(",");
        if (req.body.puid.length > 0) {
            req.body.puid = crypto.createHash("sha512").update(req.body.puid).digest("hex");
        }

        await Models.dues.createNewMember(req.body);

    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Member added!");
    return next();
});

/*
    Update the payment status or information of a dues member
*/
router.put("/:duesid", async(req, res, next) => {
    // Path for updating dues payment status
    if (req.body.status !== undefined && req.body.status !== "") {
        if (!payment_status.includes(req.body.status)) {
            res.status(400).send("Payment status must be 'Paid' or 'Exempt'");
            return next();
        }

        if (req.body.amount === undefined || req.body.amount === "") {
            res.status(400).send("Must include amount");
            return next();
        }

        if (req.body.status === "Paid" && !dues_amount.includes(req.body.amount)) {
            res.status(400).send("Incorrect amount");
            return next();
        }

        if (req.body.status === "Exempt" && req.body.amount !== 0) {
            res.status(400).send("Cannot be 'Exempt' and have an amount");
            return next();
        }

        try {
            // check the user is a treasurer
            const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
            if (results.validuser === 0) {
                res.status(200).send("Member status updated"); // silently fail on no authorization
                return next();
            }

            await Models.dues.updateDuesMemberStatus(req.params.duesid, req.body.status, req.body.amount);
            res.status(200).send("Member status updated");
            return next();
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    } else if (req.body.email !== undefined && req.body.email !== "" &&
               req.body.name !== undefined && req.body.name !== "" &&
               req.body.committees !== undefined) {

        if (typeof(req.body.committees) !== "object" ||
                    req.body.committees.length === 0) {
            res.status(400).send("Member must be in at least one committee");
            return next();
        }

        // validate each committee we are trying to add actually exists
        for (let comm of req.body.committees) {
            if (comm === "None" && req.body.committees.length > 1) {
                res.status(400).send("'None' and another committee selected");
                return next();
            }
            if (!dues_committees.includes(comm) && comm !== "None") {
                res.status(400).send("Invalid committee value");
                return next();
            }
        }

        try {
            // first make sure user is actually a treasurer
            const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
            if (results.validuser === 0) {
                res.status(200).send("Member details updated"); // Silently fail on no authorization
                return next();
            }

            req.body.committees = req.body.committees.join(",");

            await Models.dues.updateMemberDetails(req.params.duesid, req.body);
            res.status(200).send("Member details updated");

        } catch (err) {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    } else {
        res.status(400).send("Fill out the proper update details");
        return next();
    }
});

/*
    View total counts of dues members for a committee
*/
router.get("/summary/:year?", async(req, res, next) => {
    if (req.params.year === undefined) {
        req.params.year = current_fiscal_year_fyid;
    }

    if (fiscal_year_id_to_display[req.params.year] === undefined) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        // first make sure user is actually an officer
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, "%", ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(200).send({});
            return next();
        }

        const [results_1] = await Models.dues.getDuesMembers(req.params.year);
        const resp_obj = dues_committees.reduce((out, elm) => (out[elm]=[0,0], out), {});
        results_1.forEach(dues => {
            // the shit regex is a holdover since some multi-committee dues use ', ' instead of ','
            //  FIXME: this should probabaly be standardized in the db
            dues.committee.split(/(?:, |,)+/).forEach(comm => {
                if (resp_obj[comm] == undefined) {
                    resp_obj[comm] = [0,0]; // Handle case where committee is not in the current matrix
                }

                if (dues.status === "Paid" || dues.status === "Exempt") {
                    resp_obj[comm][0] += 1;
                } else {
                    resp_obj[comm][1] += 1;
                }
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
        req.params.year = current_fiscal_year_fyid;
    }

    if (fiscal_year_id_to_display[req.params.year] === undefined) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        // first make sure user is actually an officer
        const [results] = await Models.account.getUserApprovals(req.context.request_user_id, "%", ACCESS_LEVEL.officer);
        if (results.length === 0) {
            res.status(200).send([]);
            return next();
        }

        const [results_1] = await Models.dues.getDuesMembers(req.params.year);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get actual dues income for a given year
*/
router.get("/income/:year", async(req, res, next) => {
    if (fiscal_year_id_to_display[req.params.year] === undefined) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        // check the user is a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]); // silently failed on no authorization
            return next();
        }

        const [results_1] = await Models.dues.getDuesIncomeActual(req.params.year);
        res.status(200).send(results_1);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get expected dues income for a given year
*/
router.get("/expected/:year", async(req, res, next) => {
    if (fiscal_year_id_to_display[req.params.year] === undefined) {
        res.status(404).send("Invalid fiscal year");
        return next();
    }

    try {
        // check the user is a treasurer
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send({total:0,}); // silently failed on no authorization
            return next();
        }

        const [results_1] = await Models.dues.getDuesIncomeExpected(req.params.year);
        res.status(200).send({total:results_1.reduce((prev, curr) => { return prev + curr.amount; }, 0),});
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
