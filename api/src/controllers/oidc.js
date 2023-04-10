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

import { Issuer, generators } from "openid-client";

import { ACCESS_LEVEL } from "../common_items.js";
import { logger } from "../utils/logging.js";
import Models from "../models/index.js";

let oidcIssuer;
let oidcClient;

function get_oidc_login(req, res, next) {
    const code_verifier = generators.codeVerifier();
    req.session.code_verifier = code_verifier;
    req.session.save();

    const code_challenge = generators.codeChallenge(code_verifier);
    const oidc_url = oidcClient.authorizationUrl({ code_challenge, code_challenge_method: "S256", });

    res.redirect(oidc_url);
    next();
}

async function get_oidc_callback(req, res, next) {
    if (!req.session.code_verifier) {
        res.status(404).send("");
        return next();
    }
    try {
        const params = oidcClient.callbackParams(req);
        const tokenSet = await oidcClient.callback(process.env.OIDC_REDIRECT_URI, params, { code_verifier: req.session.code_verifier, });
        const userinfo = await oidcClient.userinfo(tokenSet);
        req.session.userinfo = userinfo;
        req.session.save();

        let [results] = await Models.account.loginOIDCUser(userinfo.sub);

        // SSO User does not have a linked Boiler Books account
        if (results.length === 0) {
            const [results_1] = await Models.account.getUserByEmail(userinfo.email);
            //  They really don't have an account, we must register them at the UI OIDC endpoint
            if (results_1.length === 0) {
                res.redirect("/ui/oidc/register");
                return next();
            }

            await Models.account.linkOIDCUser(results_1[0].username, userinfo.sub);
            results = results_1;
        }

        // SSO User does exist, so we must dump them to the UI OIDC endpoint
        //  First, we should check if any OIDC information differs from their given information
        const response = await Models.account.getUserByID(results[0].username);
        if (response[0].first !== userinfo.given_name ||
            response[0].last !== userinfo.family_name ||
            response[0].email !== userinfo.email) {
            await Models.account.updateUserOIDC(userinfo.given_name, userinfo.family_name, userinfo.email, results[0].username);
        }

        const response_1 = await Models.account.generateAPIKey(results[0].username);
        res.cookie("apikey", response_1, { maxAge:1000*60*60*24, sameSite:"strict",}); // cookie is valid for 24 hours
        res.redirect("/ui/oidc/login");
        return next();
    } catch (err) {
        logger.error(err);
        res.status(500).send("Internal server error");
        return next();
    }
}

function get_oidc_logout(req, res, next) {
    const logout_url = oidcClient.endSessionUrl();

    res.redirect(logout_url);
    next();
}

async function get_oidc_userinfo(req, res, next) {
    if (!req.session.userinfo) {
        res.status(401).send("Must authenticate first");
        return next();
    }

    // There is an API key, so we know that the login was successful
    //  This API endpoint is being hit for the permissions information
    if (req.cookies && req.cookies.apikey) {
        try {
            const [results] = await Models.account.associateAPIKeyToUser(req.cookies.apikey);

            if (results.length === 0) {
                logger.info(`[] - "${req.originalUrl}" - Return 401`);
                return res.status(401).send("Invalid API Key");
            }

            const dbtime = new Date(results[0].apikeygentime);
            const exptime = new Date(dbtime.setHours(dbtime.getHours() + 24)); // key expires after 24 hours
            const now = new Date();
            if (now >= exptime) {
                logger.info(`[] - "${req.originalUrl}" - Return 401`);
                return res.status(401).send("Invalid API Key");
            }

            // Setup the return object
            const user = {
                uname: results[0].username,
                full_name: results[0].first + " " + results[0].last,
            };

            // Get all privilege levels
            const [response] = await Models.account.getUserAccessLevel(results[0].username);
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

            res.status(200).send(user);
            return next();
        } catch (err) {
            logger.error(err.stack);
            logger.info(`[] - "${req.originalUrl}" - Return 500`);
            return res.status(500).send("Internal Server Error");
        }
    }

    // There is not an API key, so we know that the UI is trying to prefill information
    res.status(200).send(req.session.userinfo);
    next();
}

/*
    Creates a new user account
*/
async function post_oidc_register(req, res, next) {
    if (!req.session.userinfo) {
        res.status(401).send("Must authenticate first");
        return next();
    }

    if (req.body.address === undefined ||
        req.body.city === undefined ||
        req.body.state === undefined ||
        req.body.zip === undefined ||
        req.body.createpin === undefined) {
        res.status(400).send("All account details must be completed");
        return next();
    }

    if (req.body.address === "" ||
        req.body.city === "" ||
        req.body.state === "" ||
        req.body.zip === "" ||
        req.body.createpin === "") {
        res.status(400).send("All account details must be completed");
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

    if (req.body.createpin !== process.env.ACCOUNT_PIN) {
        res.status(400).send("Incorrect Account Creation PIN");
        return next();
    }

    req.body.fname = req.session.userinfo.given_name;
    req.body.lname = req.session.userinfo.family_name;
    req.body.email = req.session.userinfo.email;
    req.body.uname = req.session.userinfo.email.split("@")[0];

    try {
        // First try and create the account
        await Models.account.createUser(req.body, "", req.session.userinfo.sub);

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
        // Username already exists (should not ever get hit)
        if (err.code === "ER_DUP_ENTRY") {
            logger.error("DUPLICATE USERNAME/EMAIL:" + req.body.uname);
            res.status(400).send("Unexpected Error: Please contact Purdue IEEE!");
            return next();
        } else {
            logger.error(err.stack);
            res.status(500).send("Internal Server Error");
            return next();
        }
    }
}

let oidc_good = false;
let try_count = 0;
async function setupOIDC(cb) {
    try {
        oidcIssuer = await Issuer.discover(process.env.OIDC_SERVER);
        oidcClient = new oidcIssuer.Client({
            client_id: process.env.OIDC_CLIENT_ID,
            client_secret: process.env.OIDC_CLIENT_SECRET,
            redirect_uris: [process.env.OIDC_REDIRECT_URI],
            response_types: ["code"],
        });
        cb(false);
    } catch (err) {
        if (err.code) {
            return cb({ message: err.code, });
        }
        cb({ message: err.error, });
    }
}
function oidc_startup() {
    setupOIDC((err) => {
        if (!err) {
            logger.info("OIDC SSO server discovered");
            oidc_good = true;
            return;
        }
        logger.error(`OIDC SSO server discovery fail ${try_count}: ${err.message}`);
        try_count += 1;
        if (try_count >= 5) {
            logger.error("OIDC SSO server was not discovered");
            process.exit(1);
        }
        setTimeout(oidc_startup, try_count * 1000); // Retyr the startup, backoff longer each time
    });
}
function oidc_check() {
    return process.env.USE_OIDC === "true" ? oidc_good : true;
}
// Only do the startup if we are using OIDC
if (process.env.USE_OIDC === "true") {
    oidc_startup();
}


export {
    oidc_check,
    get_oidc_login,
    get_oidc_callback,
    get_oidc_logout,
    get_oidc_userinfo,
    post_oidc_register,
};
