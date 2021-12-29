import { v4 as uuidv4} from 'uuid';
import { Router } from 'express';

const router = Router();

const blank_perms =
{
    'general'  : false,
    'aerial'   : false,
    'csociety' : false,
    'embs'     : false,
    'g-and-e'  : false,
    'mtt-s'    : false,
    'ir'       : false,
    'learning' : false,
    'racing'   : false,
    'rov'      : false,
    'social'   : false,
    'soga'     : false,
};

router.get('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

router.head('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

router.put('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

router.delete('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

router.post('/', (req, res) => {
    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.uname === undefined ||
        req.body.email === undefined) {
        return res.status(400).send({ status: 400, response: "All account details must be completed." });
    }

    if (req.body.fname === "" ||
        req.body.lname === "" ||
        req.body.uname === "" ||
        req.body.email === "") {
        return res.status(400).send({ status: 400, response: "All account details must be completed." });
    }

    const id = uuidv4();
    const user = {
        id,
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        email: req.body.email,
        approver_permission: blank_perms,
        officer_permission: false,
        treasurer_permission: false,
    };

    req.context.models.account.createUser(id, user);

    return res.status(201).send({ status: 201, response: "User created." });
});

router.get('/:userID', (req, res) => {
    const user = req.context.models.account.getUserByID(req.params.userID);

    if (user === undefined) {
        return res.status(404).send({ status: 404, response: "User not found." });
    }

    if (user.id !== req.context.request_user_id) {
        return res.status(404).send({ status: 404, response: "User not found." });
    }

    const sanitized_user = // basically remove permissions from GET request response
    {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        uname: user.uname,
        email: user.email,
    };

    return res.status(200).send({ status: 200, response: sanitized_user });
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

export default router;
