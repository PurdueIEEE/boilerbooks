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
import models, { db_conn } from "./models/index.js";
import { logger } from "./common_items.js";
import routes from "./routes/index.js";

// Create Express
const app = express();

// Setup predefined middleware
app.use(cors({ credentials:true, origin:true, maxAge:3600,})); // allow caching for 1 hour (firefox max is 24hrs, chromium max is 2hrs)
app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(cookieParser());

// Setup our middleware
app.use((req, res, next) => {
    // If we are attempting to go to the /account or /login endpoints, don't authenticate
    if (req.originalUrl === "/account" || req.originalUrl.startsWith("/login")) {
        req.context = {
            models,
        };
        next();
    } else {
        // use an API key with the Authorization header
        if (req.cookies.apikey === undefined) {
            logger.info(`[] - "${req.originalUrl}" - Return 401`);
            if (req.originalUrl.startsWith("/receipt")) {
                return res.redirect("/ui/login");
            }
            return res.status(401).send("Must authenticate first");
        }

        db_conn.execute(
            "SELECT username, apikeygentime FROM Users WHERE Users.apikey = ?",
            [req.cookies.apikey],
            function(err, results, fields) {
                if (err) {
                    logger.error(err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                if (results.length === 0) {
                    logger.info(`[] - "${req.originalUrl}" - Return 401`);
                    if (req.originalUrl.startsWith("/receipt")) {
                        return res.redirect("/ui/login");
                    }
                    return res.status(401).send("Invalid API Key");
                }

                const dbtime = new Date(results[0].apikeygentime);
                const exptime = new Date(dbtime.setHours(dbtime.getHours() + 24)); // key expires after 24 hours
                const now = new Date();
                if (now >= exptime) {
                    logger.info(`[] - "${req.originalUrl}" - Return 401`);
                    if (req.originalUrl.startsWith("/receipt")) {
                        return res.redirect("/ui/login");
                    }
                    return res.status(401).send("Invalid API Key");
                }

                req.context = {
                    models,
                    request_user_id: results[0].username,
                };
                next();
            }
        );
    }
});

// Setup our routes
app.use("/account", routes.account);
app.use("/budgets", routes.budgets);
app.use("/purchase", routes.purchase);
app.use("/committee", routes.committee);
app.use("/login", routes.login);
app.use("/receipt", routes.receipt);
app.use("/income", routes.income);
app.use("/access", routes.access);
app.use("/dues", routes.dues);

// Log every route and it's result
//   does not catch invalid API keys
app.use((req, res, next) => {
    logger.info(`[${req.context.request_user_id ? req.context.request_user_id : ""}] - Return ${res.statusCode} - "${req.method} ${req.originalUrl}"`);
    next();
});

// Start and attach app
const server = app.listen(process.env.PORT, () =>
    logger.info(`App listening on port ${process.env.PORT}`)
);

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
