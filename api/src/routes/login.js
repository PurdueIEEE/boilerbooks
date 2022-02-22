import { Router } from "express";
import { mailer, logger } from "../common_items";

const router = Router();

// ---------------------------
// Start unauthenticated endpoints
// ---------------------------

/*
    Logs user in
    cannot be async because of bcrypt
*/
router.post("/", async(req, res) => {
    if (req.body.uname === undefined || req.body.uname === "" ||
        req.body.pass === undefined || req.body.pass === "") {
        return res.status(400).send("Fill out login details");
    }

    const user = {
        uname: req.body.uname,
        pass: req.body.pass,
    };

    req.context.models.account.loginUser(user, res);
});

/*
    Finds all usernames associated with an email and sends the email to the requester
*/
router.post("/forgot-user", async(req, res) => {
    if (req.body.email === undefined || req.body.email === "") {
        return res.status(400).send("Email must be included");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserByEmail(req.body.email);
        res.status(200).send("If that account exists, an email was send the provided address.");
        let list_of_users = results.map((element) => (element.username)).join(", ");
        await mailer.sendMail({
            to: req.body.email,
            subject: "Boiler Books Username Reminder",
            text: "Hello! A reminder of your username was requested.\n" +
                  "The username(s) associated with this email are (if blank, no account exists):\n\n" +
                  `* ${list_of_users} *\n\n` +
                  "If you did not request this reminder, please ignore this message.\n" +
                  "This email was automatically sent by Boiler Books",
            html: `<h2>Hello! A reminder of your username was requested.</h2>
                   <p>The username(s) associated with this email are (if blank, no account exists):<p>
                   <p>* <b>${list_of_users}</b> *</p>
                   <p>If you did not request this email, please ignore this message.</p>
                   <br>
                   <small>This email was automatically sent by Boiler Books</small>`,
        });

    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

// ---------------------------
// End unauthenticated endpoints
// ---------------------------

export default router;
