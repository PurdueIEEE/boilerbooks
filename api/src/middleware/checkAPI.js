import { db_conn } from "../models/index.js";
import { logger } from "../common_items.js";

async function checkAPI(req, res, next) {
    // If we are attempting to go to the /account or /login endpoints, don't authenticate
    if (req.originalUrl === "/account" || req.originalUrl.startsWith("/login")) {
        req.context = {};
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

        try {
            const [results] = await db_conn.promise().execute(
                "SELECT username, apikeygentime FROM Users WHERE Users.apikey = ?",
                [req.cookies.apikey]
            );

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
