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

import Models from "../models/index.js";
import { logger } from "../common_items.js";

async function checkAPI(req, res, next) {
    // If we are attempting to go to the /account or /login endpoints, don't authenticate
    if (req.originalUrl.startsWith("/login") || req.originalUrl.startsWith("/oidc")) {
        req.context = {};
        next();
    } else {
        // use an API key with the Authorization header
        if (req.cookies.apikey === undefined) {
            logger.info(`[] - "${req.originalUrl}" - Return 401`);
            return res.status(401).send("Must authenticate first");
        }

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

            req.context = {
                request_user_id: results[0].username,
            };
            next();

        } catch (err) {
            logger.error(err.stack);
            logger.info(`[] - "${req.originalUrl}" - Return 500`);
            return res.status(500).send("Internal Server Error");
        }
    }
}

export default checkAPI;
