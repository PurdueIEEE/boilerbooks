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

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    ignoreTLS: true,
},{
    from: "Boiler Books <boilerbooks@purdueieee.org>",
});

// Backoff smtp startup check
let try_count = 0;
let smtp_good = false;
function smtp_startup() {
    mailer.verify((err) => {
        if (!err) {
            logger.info("SMTP connection verified");
            smtp_good = true;
            return;
        }
        logger.error(`SMTP connection fail ${try_count}: ${err.message}`);
        try_count += 1;
        if (try_count >= 5) {
            logger.error("SMTP connection failed to verify");
            process.exit(1);
        }
        setTimeout(smtp_startup, try_count * 1000); // Retry the startup, backoff longer each time
    });
}
function smtp_check() {
    return smtp_good;
}
smtp_startup();

export {
    mailer,
    smtp_check,
};
