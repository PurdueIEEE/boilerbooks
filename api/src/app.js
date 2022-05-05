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

// Import libraries
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import files
import { db_conn, db_check } from "./models/index.js";
import { logger, smtp_check } from "./common_items.js";
import routes from "./routes/index.js";
import checkAPI from "./middleware/checkAPI.js";

// Create Express
const app = express();

// Setup predefined middleware
app.use(cors({ credentials:true, origin:true, maxAge:3600,})); // allow caching for 1 hour (firefox max is 24hrs, chromium max is 2hrs)
app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(cookieParser());

// Setup our middleware
app.use(checkAPI);

// Setup our routes
app.use("/account", routes.account);
app.use("/budgets", routes.budgets);
app.use("/purchase", routes.purchase);
app.use("/committee", routes.committee);
app.use("/login", routes.login);
app.use("/receipts", routes.receipt);
app.use("/income", routes.income);
app.use("/access", routes.access);
app.use("/dues", routes.dues);

// Log every route and it's result
//   does not catch invalid API keys
app.use((req, res, next) => {
    logger.info(`[${req.context.request_user_id ? req.context.request_user_id : ""}] - Return ${res.statusCode} - "${req.method} ${req.originalUrl}"`);
    next();
});

// Before attaching the process, make sure the database and smtp server are online
let aux_check_num = setInterval(() => {
    if (db_check() && smtp_check()) {
        clearInterval(aux_check_num);
        // Start and attach app
        const server = app.listen(process.env.PORT, () => {
            logger.info(`App listening on port ${process.env.PORT}`);
        });

        process.on("SIGTERM", () => {
            logger.warn("SIGTERM signal received: closing server");
            server.close(() => {
                logger.warn("HTTP server closed");
            });
            db_conn.end(() => {
                logger.warn("MySQL connection closed");
            });
        });

        process.on("SIGINT", () => {
            logger.warn("SIGINT signal received: closing server");
            server.close(() => {
                logger.warn("HTTP server closed");
            });
            db_conn.end(() => {
                logger.warn("MySQL connection closed");
            });
        });
    }
}, 500); // 500ms is offset from all the wait periods
