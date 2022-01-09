import { Router } from 'express';

const router = Router();

import { committee_name_swap, clean_input_encodeurl, unescape_object } from '../common_items';

// ---------------------------
// Start unauthenticated endpoint
//  cannot be async because of bcrypt
// ---------------------------

router.post('/', (req, res) => {
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
        return res.status(400).send("All account details must be completed");
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
        return res.status(400).send("All account details must be completed");
    }

    // escape all input
    req.body.fname = clean_input_encodeurl(req.body.fname);
    req.body.lname = clean_input_encodeurl(req.body.lname);
    req.body.uname = clean_input_encodeurl(req.body.uname);
    req.body.email = clean_input_encodeurl(req.body.email);
    req.body.address = clean_input_encodeurl(req.body.address);
    req.body.city = clean_input_encodeurl(req.body.city);
    req.body.state = clean_input_encodeurl(req.body.state);
    req.body.zip = clean_input_encodeurl(req.body.zip);


    if (req.body.createpin !== process.env.ACCOUNT_PIN) {
        return res.status(400).send("Incorrect Creation PIN");
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

// ---------------------------
// End unauthenticated endpoint
// ---------------------------

router.get('/:userID', async (req, res) => {
    try {
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0 || req.context.request_user_id !== req.params.userID) {
            return res.status(404).send("User not found");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    try {
        const [results, fields] = await req.context.models.account.getUserByID(req.params.userID);
        if (results.length === 0) {
            return res.status(400).send("User not found");
        }

        return res.status(200).send(unescape_object(results[0]));
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.put('/:userID', async (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.email === undefined ||
        req.body.address === undefined ||
        req.body.city === undefined ||
        req.body.state === undefined ||
        req.body.zip === undefined) {
        return res.status(400).send("All account details must be completed");
    }

    if (req.body.fname === "" ||
        req.body.lname === "" ||
        req.body.email === "" ||
        req.body.address === "" ||
        req.body.city === "" ||
        req.body.state === "" ||
        req.body.zip === "") {
        return res.status(400).send("All account details must be completed");
    }

    // escape all input
    req.body.fname = clean_input_encodeurl(req.body.fname);
    req.body.lname = clean_input_encodeurl(req.body.lname);
    req.body.email = clean_input_encodeurl(req.body.email);
    req.body.address = clean_input_encodeurl(req.body.address);
    req.body.city = clean_input_encodeurl(req.body.city);
    req.body.state = clean_input_encodeurl(req.body.state);
    req.body.zip = clean_input_encodeurl(req.body.zip);


    const user = {
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.context.request_user_id,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
    };

    try {
        const [] = await req.context.models.account.updateUser(user);
        return res.status(200).send("Account Details Updated");
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.post('/:userID', (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    if (req.body.pass1 === undefined ||
        req.body.pass2 === undefined) {
        return res.status(400).send("All account details must be completed");
    }

    if (req.body.pass1 === "" ||
        req.body.pass2 === "") {
        return res.status(400).send("All account details must be completed");
    }

    if (req.body.pass1 !== req.body.pass2) {
        return res.status(400).send("Passwords do not match")
    }

    // no need to escape, it's all getting hashed

    const user = {
        uname: req.context.request_user_id,
        pass: req.body.pass1,
    }

    req.context.models.account.updatePassword(user, res);
});

router.get('/:userID/purchases', async (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    try {
        const [results, fields] = await req.context.models.purchase.getPurchaseByUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
            purchase = unescape_object(purchase);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/:userID/approvals', async (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    try {
        const [results, fields] = await req.context.models.purchase.getApprovalsForUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
            purchase = unescape_object(purchase);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/:userID/completions', async (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    try {
        const [results, fields] = await req.context.models.purchase.getCompletionsForUser(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
            purchase = unescape_object(purchase);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/:userID/reimbursements', async (req, res) => {
    if (req.context.request_user_id !== req.params.userID) {
        return res.status(404).send("User not found");
    }

    try {
        const [results, fields] = await req.context.models.purchase.getTreasurer(req.params.userID);
        results.forEach(purchase => {
            purchase.committee = committee_name_swap[purchase.committee];
            purchase = unescape_object(purchase);
        });
        return res.status(200).send(results);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
