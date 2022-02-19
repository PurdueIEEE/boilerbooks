import { Router } from "express";

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

// ---------------------------
// End unauthenticated endpoints
// ---------------------------

export default router;
