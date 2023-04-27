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

import { Issuer } from "openid-client";
import { logger } from "./logging.js";
import { sleep } from "../common_items.js";

const MAX_TRIES = 5;

let oidcIssuer;
let oidcClient;

async function setupOIDC() {
    try {
        oidcIssuer = await Issuer.discover(process.env.OIDC_SERVER);
        oidcClient = new oidcIssuer.Client({
            client_id: process.env.OIDC_CLIENT_ID,
            client_secret: process.env.OIDC_CLIENT_SECRET,
            redirect_uris: [process.env.OIDC_REDIRECT_URI],
            response_types: ["code"],
        });
        return true;
    } catch (err) {
        if (err.code) {
            throw err.code;
        }
        throw err.error;
    }
}

async function loopSetupOIDC(try_count) {
    if (try_count == 0) {
        throw false;
    }

    try {
        return await setupOIDC();
    } catch (err) {
        logger.warn(`OIDC SSO server discovery fail ${try_count}: ${err}`);
        if (try_count == 1) {
            throw false;
        }
        await sleep(1000 * (MAX_TRIES - try_count + 1));
        return await loopSetupOIDC(try_count - 1);
    }
}

async function init() {
    if (process.env.USE_OIDC !== "true") {
        return true;
    }

    return await loopSetupOIDC(MAX_TRIES);
}

async function finalize() {
    return true;
}

async function update() {
    return true;
}

export {
    oidcClient,
};

export default {
    init,
    finalize,
    update,
};
