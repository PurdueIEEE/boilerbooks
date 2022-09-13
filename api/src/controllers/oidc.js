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

import { logger } from "../common_items.js";
import Models from "../models/index.js";

let oidcIssuer;
let oidcClient;

function get_oidc_login(req, res, next) {
    const code_verifier = generators.codeVerifier();
    req.session.code_verifier = code_verifier;
    req.session.save((err) => {
        if (err) {
            logger.error(err);
            res.status(500).send("Internal server error");
            return next();
        }

        const code_challenge = generators.codeChallenge(code_verifier);

        const oidc_url = oidcClient.authorizationUrl({ code_challenge, code_challenge_method: "S256", });

        res.redirect(oidc_url);
        next();
    });
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

        const [results] = await Models.account.loginOIDCUser(userinfo.email);

        // SSO User does not have a Boiler Books account, we must register them at the U OIDC endpoint
        if (results.length === 0) {
            res.redirect("/ui/login");
            return next();
        }

        // SSO User does exist, so we must dump them to the UI OIDC endpoint
        const response_1 = await Models.account.generateAPIKey(results[0].username);
        res.cookie("apikey", response_1, { maxAge:1000*60*60*24, sameSite:"strict",}); // cookie is valid for 24 hours
        res.redirect("/ui/");
        return next();
    } catch (err) {
        logger.error(err);
        res.status(500).send("Internal server error");
        return next();
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
            return cb({ message: err.code });
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
if (process.env.USE_OIDC) {
    oidc_startup();
}


export {
    oidc_check,
    get_oidc_login,
    get_oidc_callback,
};
