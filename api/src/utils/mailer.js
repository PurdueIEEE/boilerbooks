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

import nodemailer from "nodemailer";
import { logger } from "./logging.js";
import { sleep } from "../common_items.js";

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    ignoreTLS: process.env.SMTP_IGNORE_TLS == "true",
},{
    from: "Boiler Books <boilerbooks@purdueieee.org>",
});

const MAX_TRIES = 5;

// Small helper function to check the SMTP connection by
//  using an internal mailer function
function checkSMTP() {
    return new Promise((resolve, reject) => {
        mailer.verify((err) => {
            if (!err) {
                resolve(true);
            } else {
                reject(err.message);
            }
        });
    });
}

async function loopCheckSMTP(try_count) {
    if (try_count == 0) {
        throw false;
    }
    try {
        return await checkSMTP();
    } catch (err) {
        logger.warn(`SMTP connection fail ${try_count}: ${err}`);
        if (try_count == 1) {
            throw false;
        }
        await sleep(1000 * (MAX_TRIES - try_count + 1));
        return await loopCheckSMTP(try_count - 1);
    }
}

async function init() {
    return await loopCheckSMTP(MAX_TRIES);
}

async function finalize() {
    return true;
}

async function update() {
    return true;
}

// Specific exports
export {
    mailer,
};

// Standardized exports
export default {
    init,
    finalize,
    update,
};
