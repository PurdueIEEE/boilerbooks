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
import { committee_name_swap, committee_lut, logger, mailer, ACCESS_LEVEL, committee_name_api } from "../common_items.js";

import bcrypt from "bcrypt";

const router = Router();
const bcrypt_rounds = 10;

// ---------------------------
// Start unauthenticated endpoint
// ---------------------------

/*
    Creates a new user account
*/
router.post("/", async(req, res, next) => {
    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.uname === undefined ||
        req.body.email === undefined ||
        req.body.address === undefined ||
        req.body.city === undefined ||
        req.body.state === undefined ||
        req.body.zip === undefined ||
        req.body.pass1 === undefined ||
        req.body.pass2 === undefined ||
        req.body.createpin === undefined) {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.fname === "" ||
        req.body.lname === "" ||
        req.body.uname === "" ||
        req.body.email === "" ||
        req.body.address === "" ||
        req.body.city === "" ||
        req.body.state === "" ||
        req.body.zip === "" ||
        req.body.pass1 === "" ||
        req.body.pass2 === "" ||
        req.body.createpin === "") {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.fname.length > 100) {
        res.status(400).send("First Name is too long");
        return next();
    }
    if (req.body.lname.length > 100) {
        res.status(400).send("Last Name is too long");
        return next();
    }
    if (req.body.email.length > 200) {
        res.status(400).send("Email is too long");
        return next();
    }
    if (req.body.address.length > 200) {
        res.status(400).send("Address is too long");
        return next();
    }
    if (req.body.city.length > 100) {
        res.status(400).send("City is too long");
        return next();
    }

    if (req.body.state.length !== 2) {
        res.status(400).send("State must be a 2 letter abbreviation");
        return next();
    }

    if (req.body.uname.length > 50) {
        res.status(400).send("Username is too long");
    }

    // eslint-disable-next-line
    if (/[$&+,/:;=?@ "<>#%{}|\\^~\[\]`]/.test(req.body.uname)) {
        res.status(400).send("Username cannot contain any special characters");
        return next();
    }

    // eslint-disable-next-line
    if (/[^\u0000-\u007f]/.test(req.body.uname)) {
        res.status(400).send("Username cannot contain any Unicode characters");
        return next();
    }

    if (req.body.createpin !== process.env.ACCOUNT_PIN) {
        res.status(400).send("Incorrect Account Creation PIN");
        return next();
    }

    if (req.body.pass1 !== req.body.pass2) {
        res.status(400).send("Passwords do not match");
        return next();
    }

    if (req.body.pass1.length < 8) {
        res.status(400).send("Password length must be greater than 8 characters");
        return next();
    }

    bcrypt.hash(req.body.pass1, bcrypt_rounds, async(error, hash) => {
        if (error) {
            logger.error(error);
            res.status(500).send("Internal Server Error");
            return next();
        }

        try {
            // First try and create the account
            await Models.account.createUser(req.body, hash);

            // Setup the return object
            const user = {
                uname: req.body.uname,
            };

            // Get all privilege levels
            const [response] = await Models.account.getUserAccessLevel(req.body.uname);
            if (response[0].maxPrivilege !== null) {
                user.viewFinancials = true;
                user.viewApprove = response[0].maxAmount > 0;
                user.viewOfficer = response[0].maxPrivilege >= ACCESS_LEVEL.officer;
                user.viewTreasurer = response[0].maxPrivilege >= ACCESS_LEVEL.treasurer;
            } else {
                user.viewFinancials = false;
                user.viewApprove = false;
                user.viewOfficer = false;
                user.viewTreasurer = false;
            }

            // Generate the API key now
            const response_1 = await Models.account.generateAPIKey(req.body.uname);
            res.cookie("apikey", response_1, { maxAge:1000*60*60*24, sameSite:"strict",}); // cookie is valid for 24 hours
            res.status(201).send(user);
            return next();
        } catch (err) {
            // Username already exists
            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).send("Username already exists");
                return next();
            } else {
                logger.error(err.stack);
                res.status(500).send("Internal Server Error");
                return next();
            }
        }
    });
});

// ---------------------------
// End unauthenticated endpoint
// ---------------------------

/*
    Gets user details, only if requester is the user or the Treasurer
*/
router.get("/:userID", async(req, res, next) => {
    try {
        const [results] = await Models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0 && req.context.request_user_id !== req.params.userID) {
            res.status(404).send("User not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await Models.account.getUserByID(req.params.userID);
        if (results.length === 0) {
            res.status(400).send("User not found");
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
    Updates user account details, requester must be user
*/
router.put("/:userID", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.email === undefined ||
        req.body.address === undefined ||
        req.body.city === undefined ||
        req.body.state === undefined ||
        req.body.zip === undefined) {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.fname === "" ||
        req.body.lname === "" ||
        req.body.email === "" ||
        req.body.address === "" ||
        req.body.city === "" ||
        req.body.state === "" ||
        req.body.zip === "") {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.state.length !== 2) {
        res.status(400).send("State must be a 2 letter abbreviation");
        return next();
    }

    req.body.uname = req.context.request_user_id;

    try {
        await Models.account.updateUser(req.body);
        res.status(200).send("Account Details Updated");
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Changes user password, requester must be user
    Cannot be async because of bcrypt
*/
router.post("/:userID", (req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    if (req.body.pass1 === undefined ||
        req.body.pass2 === undefined) {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.pass1 === "" ||
        req.body.pass2 === "") {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.pass1 !== req.body.pass2) {
        res.status(400).send("Passwords do not match");
        return next();
    }

    // But this can by async
    bcrypt.hash(req.body.pass1, bcrypt_rounds, async function(error, hash) {
        const user = {
            uname: req.context.request_user_id,
            pass: hash,
        };

        try {
            await Models.account.updatePassword(user);
            const [results] = await Models.account.getUserByID(req.context.request_user_id);
            res.status(200).send("Password Changed");
            await mailer.sendMail({
                to: results[0].email,
                subject: "Boiler Books Password Changed",
                text: "Your Boiler Books password was recently changed.\n" +
                      "If you made this request, you can safely ignore this message.\n" +
                      "Otherwise, please reach out to IEEE.\n\n" +
                      "This email was automatically sent by Boiler Books",
                html: `<h2>Your Boiler Books password was recently changed.</h2>
                       <p>If you made this request, you can safely ignore this message.<p>
                       <p><b>Otherwise, please reach out to IEEE.</b></p>
                       <br>
                       <small>This email was automatically sent by Boiler Books</small>`,
            });
            next();
        } catch (err) {
            logger.error(err.stack);
            if (!res.headersSent) res.status(500).send("Internal Server Error");
            return next();
        }
    });
});

/*
    Get a list of all purchases made by the user
*/
router.get("/:userID/purchases", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.purchase.getPurchaseByUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a list of all active requests user can approve
*/
router.get("/:userID/approvals", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.purchase.getApprovalsForUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a list of all active purchases user can complete
*/
router.get("/:userID/completions", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.purchase.getCompletionsForUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a list of all active purchases user can reimburse
*/
router.get("/:userID/reimbursements", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.purchase.getTreasurer(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
        });
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a list of all mailed checks for the user
*/
router.get("/:userID/checks", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.purchase.getChecks(req.params.userID);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get a list of all committee balances user can view
*/
router.get("/:userID/balances", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    const committees = Object.keys(committee_name_swap);
    const outputBalances = {};

    try {
        for (let committee of committees) {
            const [results] = await Models.account.getUserApprovals(req.context.request_user_id, committee, ACCESS_LEVEL.internal_leader);
            if (results.length !== 0) {
                const [results_1] = await Models.committee.getCommitteeBalance(committee);
                outputBalances[committee_name_swap[committee]] = results_1[0].balance;
            }
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(200).send(outputBalances);
    next();
});

/*
    Get a list of all committees user has approval powers in
*/
router.get("/:userID/committees", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.account.getUserApprovalCommittees(req.params.userID);

        // very slow very bad
        let filtered_lut = {};
        for (let committee in committee_lut) {
            for (let approval of results) {
                if (committee_lut[committee][0] == approval.committee) {
                    filtered_lut[committee] = committee_lut[committee];
                }
            }
        }

        res.status(200).send(filtered_lut);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Return all dues user has paid
*/
router.get("/:userID/dues", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.account.getUserDues(req.context.request_user_id);
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get the last committee a user made a purchase for
*/
router.get("/:userID/committee/purchases", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.account.getLastPurchaseCommittee(req.context.request_user_id);
        if (results.length > 0) {
            res.status(200).send(committee_name_api[results[0].committee]);
            return next();
        } else {
            res.status(200).send("");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Get the last committee a user entered income in
*/
router.get("/:userID/committee/income", async(req, res, next) => {
    if (req.context.request_user_id !== req.params.userID) {
        res.status(404).send("User not found");
        return next();
    }

    try {
        const [results] = await Models.account.getLastIncomeCommittee(req.context.request_user_id);
        if (results.length > 0) {
            res.status(200).send(committee_name_api[results[0].committee]);
            return next();
        } else {
            res.status(200).send("");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
