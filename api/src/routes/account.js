import { Router } from 'express';

const router = Router();

// ---------------------------
// Start unauthenticated endpoints
// ---------------------------
router.post('/new', (req, res) => {
    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.uname === undefined ||
        req.body.email === undefined ||
        req.body.address === undefined ||
        req.body.city === undefined ||
        req.body.state === undefined ||
        req.body.zip === undefined ||
        req.body.pass1 === undefined ||
        req.body.pass2 === undefined ||
        req.body.createpin === undefined) {
        return res.status(400).send("All account details must be completed.");
    }

    if (req.body.fname === "" ||
        req.body.lname === "" ||
        req.body.uname === "" ||
        req.body.email === "" ||
        req.body.address === "" ||
        req.body.city === "" ||
        req.body.state === "" ||
        req.body.zip === "" ||
        req.body.pass1 === "" ||
        req.body.pass2 === "" ||
        req.body.createpin === "") {
        return res.status(400).send("All account details must be completed.");
    }

    // TODO escape and sanitize all input here

    if (req.body.createpin !== process.env.ACCOUNT_PIN) {
        return res.status(400).send("Incorrect Creation PIN.");
    }

    if (req.body.pass1 !== req.body.pass2) {
        return res.status(400).send("Passwords do not match");
    }

    const user = {
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        pass: req.body.pass1,
    };

    req.context.models.account.createUser(user, res);
});

router.post('/login', (req, res) => {
    if (req.body.uname === undefined || req.body.uname === '' ||
        req.body.pass === undefined || req.body.pass === '') {
        return res.status(400).send("Fill out login details.");
    }

    // TODO sanitize user input here

    const user = {
        uname: req.body.uname,
        pass: req.body.pass,
    };

    req.context.models.account.loginUser(user, res);
});

// ---------------------------
// End unauthenticated endpoints
// ---------------------------

router.get('/', (req, res) => {
    req.context.models.account.getUserByID(req.context.request_user_id, res);
});

router.get('/:userID/purchases', (req, res) => {
    const user = req.context.models.account.getUserByID(req.params.userID);

    if (user === undefined) {
        return res.status(404).send({ status: 404, response: "User not found." });
    }

    if (user.id !== req.context.request_user_id) {
        return res.status(404).send({ status: 404, response: "User not found." });
    }

    const purchases = req.context.models.purchase.getPurchaseByUser(user.id);
    return res.status(200).send({ status:200, response:purchases });
});

router.put('/:userID', (req, res) => {
    return res.status(500).send({ status:500, response:"To Be Implemented Later" }); // TODO should not be a 500
});

export default router;
