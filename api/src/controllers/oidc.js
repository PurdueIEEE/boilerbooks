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

let oidcIssuer;
let oidcClient;

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
    return oidc_good;
}
oidc_startup();


export { oidc_check };
