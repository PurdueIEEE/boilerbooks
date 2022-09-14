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
import bcrypt from "bcrypt";

import Models from "../models/index.js";
import { mailer, logger, ACCESS_LEVEL } from "../common_items.js";

const router = Router();
const bcrypt_rounds = 10;

// ---------------------------
// Start unauthenticated endpoints
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

    // force emails lowercase for OIDC purposes
    req.body.email = req.body.email.toLowerCase();

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
                full_name: req.body.fname + " " + req.body.lname,
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
                res.status(400).send("Username or email already exists");
                return next();
            } else {
                logger.error(err.stack);
                res.status(500).send("Internal Server Error");
                return next();
            }
        }
    });
});

/*
    Logs user in
*/
router.post("/password", async(req, res, next) => {
    if (req.body.uname === undefined || req.body.uname === "" ||
        req.body.pass === undefined || req.body.pass === "") {
        res.status(400).send("Fill out login details");
        return next();
    }

    try {
        // Check if username exists
        const [results] = await Models.account.loginUser(req.body.uname);
        if (results.length === 0) {
            res.status(400).send("Incorrect Username or Password");
            return next();
        }

        // Verify password
        const match = await bcrypt.compare(req.body.pass, results[0].password);
        if (!match) {
            res.status(400).send("Incorrect Username or Password");
            return next();
        }

        // Setup the return object
        const user = {
            uname: req.body.uname,
            full_name: results[0].first + " " + results[0].last,
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
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Finds all usernames associated with an email and sends the email to the requester
*/
router.post("/forgot-user", async(req, res, next) => {
    if (req.body.email === undefined || req.body.email === "") {
        res.status(400).send("Email must be included");
        return next();
    }

    try {
        const [results] = await Models.account.getUserByEmail(req.body.email);
        res.status(200).send("If that account exists, an email was send the provided address.");
        let list_of_users = results.map((element) => (element.username)).join(", ");
        await mailer.sendMail({
            to: req.body.email,
            subject: "Boiler Books Username Reminder",
            text: "Hello! A reminder of your username was requested.\n" +
                  "The username(s) associated with this email are (if blank, no account exists):\n\n" +
                  `* ${list_of_users} *\n\n` +
                  "If you did not request this reminder, please ignore this message.\n\n" +
                  "This email was automatically sent by Boiler Books",
            html: `<h2>Hello! A reminder of your username was requested.</h2>
                   <p>The username(s) associated with this email are (if blank, no account exists):<p>
                   <p>* <b>${list_of_users}</b> *</p>
                   <p>If you did not request this email, please ignore this message.</p>
                   <br>
                   <small>This email was automatically sent by Boiler Books</small>`,
        });
        return next();
    } catch (err) {
        logger.error(err.stack);
        if (!res.headersSent) res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Sends reset email to user if they exist
*/
router.post("/forgot-pass", async(req, res, next) => {
    if (req.body.user === undefined || req.body.user === "") {
        res.status(400).send("Username must be included");
        return next();
    }

    try {
        const [results] = await Models.account.getUserByID(req.body.user);
        if (results.length === 0) {
            res.status(404).send("No account found with that username - try 'Forgot Username' if you don't remember your username");
            return next();
        }
        res.status(200).send("Instructions to reset your password were sent to your email");

        const buffer = crypto.randomBytes(64);
        // Using bcrypt synchronously is not performant
        //  but this should be fine
        const reset_hash = await bcrypt.hash(buffer.toString("hex"), bcrypt_rounds);

        await Models.account.setPasswordResetDetails(req.body.user, reset_hash);

        await mailer.sendMail({
            to: results[0].email,
            subject: "Boiler Books Password Reset",
            text: `Hello! A password reset was requested for ${req.body.user}.\n` +
                  "Please go to the following URL to reset your password:\n" +
                  `https://${process.env.HTTP_HOST}/ui/passwordreset?user=${req.body.user}&rstlink=${encodeURIComponent(reset_hash)}\n` +
                  "This link will expire in 24 hours. If you did not request a password reset, please ignore this message.\n\n" +
                  "This email was automatically sent by Boiler Books",
            html: `<h2>Hello! A password reset was requested for ${req.body.user}</h2>
                   <p>Please go to the following URL to reset your password:<p>
                   <p><a href="https://${process.env.HTTP_HOST}/ui/passwordreset?user=${req.body.user}&rstlink=${encodeURIComponent(reset_hash)}">Reset My Password</a></p>
                   <p>If the above link did not work, copy/paste this into your browser: https://${process.env.HTTP_HOST}/ui/passwordreset?user=${req.body.user}&rstlink=${encodeURIComponent(reset_hash)}</p>
                   <p>This link will expire in 24 hours. If you did not request a password reset, please ignore this message.</p>
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

/*
    Resets a password
*/
router.post("/reset", async(req, res, next) => {
    if (req.body.pass1 === undefined ||
        req.body.pass2 === undefined ||
        req.body.uname === undefined ||
        req.body.rstlink === undefined) {
        res.status(400).send("All reset information must be included");
        return next();
    }

    if (req.body.pass1 === "" ||
        req.body.pass2 === "" ||
        req.body.uname === "" ||
        req.body.rstlink === "") {
        res.status(400).send("All reset information must be included");
        return next();
    }

    if (req.body.pass1 !== req.body.pass2) {
        res.status(400).send("Passwords do not match");
        return next();
    }

    try {
        const [results] = await Models.account.checkResetTime(req.body.uname, req.body.rstlink);

        if (results.length === 0 || results[0].resettime === null) {
            res.status(401).send("Reset link expired!"); // silently fail
            return next();
        }
        const dbtime = new Date(results[0].resettime);
        const exptime = new Date(dbtime.setHours(dbtime.getHours() + 24)); // reset link expires after 24 hours
        const now = new Date();
        if (now >= exptime) {
            res.status(401).send("Reset link expired!");
            return next();
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send("Internal Server Error");
        return next();
    }

    bcrypt.hash(req.body.pass1, bcrypt_rounds, async function(error, hash) {
        const user = {
            uname: req.body.uname,
            pass: hash,
        };

        try {
            await Models.account.updatePassword(user);
            const [results, fields] = await Models.account.getUserByID(req.body.uname);
            res.status(200).send("Password Reset");
            await mailer.sendMail({
                to: results[0].email,
                subject: "Boiler Books Password Reset",
                text: "Your Boiler Books password was reset.\n" +
                      "If you made this change, you can safely ignore this message.\n" +
                      "Otherwise, please reach out to IEEE.\n\n" +
                      "This email was automatically sent by Boiler Books",
                html: `<h2>Your Boiler Books password was resent.</h2>
                       <p>If you made this change, you can safely ignore this message.<p>
                       <p><b>Otherwise, please reach out to IEEE.</b></p>
                       <br>
                       <small>This email was automatically sent by Boiler Books</small>`,
            });
            return next();
        } catch (err) {
            logger.error(err.stack);
            if (!res.headersSent) res.status(500).send("Internal Server Error");
            return next();
        }
    });
});

// ---------------------------
// End unauthenticated endpoints
// ---------------------------

export default router;
