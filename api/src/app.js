// Import libraries
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import files
import models, { db_conn } from "./models";
import { logger } from "./common_items";
import routes from "./routes";

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
    if (req.originalUrl === "/account" || req.originalUrl === "/login") {
        req.context = {
            models,
        };
        next();
    } else {
        // use an API key with the Authorization header
        if (req.cookies.apikey === undefined) {
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
                    if (req.originalUrl.startsWith("/receipt")) {
                        return res.redirect("/ui/login");
                    }
                    return res.status(401).send("Invalid API Key");
                }

                const dbtime = new Date(results[0].apikeygentime);
                const exptime = new Date(dbtime.setHours(dbtime.getHours() + 24)); // key expires after 24 hours
                const now = new Date();
                if (now >= exptime) {
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
