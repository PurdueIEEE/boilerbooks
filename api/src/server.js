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
import session from "express-session";
import createMemoryStore from "memorystore";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Import files
import app from "./app.js";
import { db_conn, db_check } from "./utils/db.js";
import { smtp_check } from "./utils/mailer.js";
import { loader_check } from "./db_loaded_items.js";
import { logger } from "./utils/logging.js";
import checkAPI from "./middleware/checkAPI.js";
import apiLogger from "./middleware/logging.js";
import { oidc_check } from "./controllers/oidc.js";

const server = express();
server.set("trust proxy", 1);

// Setup the session store
if (process.env.USE_OIDC === "true") {
    const MemoryStore = createMemoryStore(session);
    server.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            sameSite: "lax", // setting it 'lax' allows us to send it through a redirect
            maxAge: 1000*60*10, // The cookie is valid for 10 minutes
            httpOnly: true,
            secure: false,
            domain: process.env.HTTP_HOST,
        },
        name: "boilerbooks_api_session",
        store: new MemoryStore(),
    }));
}

// Setup predefined middleware
server.use(cors({ credentials:true, origin:true, maxAge:3600, })); // allow caching for 1 hour (firefox max is 24hrs, chromium max is 2hrs)
server.use(express.json());
server.use(express.urlencoded({extended: true,}));
server.use(cookieParser());
server.use(rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: true,
    message: "API Rate Limit - only make 100 requests every minute",
    skip: (req, res) => { return req.originalUrl === "/"; },
}));

// Setup our middleware
server.use(checkAPI);

// Mount our routes
server.use(app);

// Add a catchall route
server.all("*", (req, res, next) => {
    if (!res.headersSent) {
        res.status(404).send(`Cannot '${req.method}' ${req.path}`);
    }
    next();
});

// Logging middleware
server.use(apiLogger);

// Before attaching the process, make sure all other services are online
let aux_check_num = setInterval(() => {
    if (db_check() && smtp_check() && oidc_check() && loader_check()) {
        clearInterval(aux_check_num);
        // Start and attach server
        const handle = server.listen(process.env.PORT, () => {
            logger.info(`App listening on port ${process.env.PORT}`);
        });

        process.on("SIGTERM", () => {
            logger.warn("SIGTERM signal received: closing server");
            handle.close(() => {
                logger.warn("HTTP server closed");
            });
            db_conn.end(() => {
                logger.warn("MySQL connection closed");
            });
        });

        process.on("SIGINT", () => {
            logger.warn("SIGINT signal received: closing server");
            handle.close(() => {
                logger.warn("HTTP server closed");
            });
            db_conn.end(() => {
                logger.warn("MySQL connection closed");
            });
        });
    }
}, 500); // 500ms is offset from all the wait periods
