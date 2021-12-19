import { v4 as uuidv4} from 'uuid';
import { Router } from 'express';

const router = Router();

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
    };

    req.context.models.account.createUser(id, user);

    return res.status(201).send({ status: 201, response: "User created." });
});

// TODO make this just a GET for /
router.get('/:userID', (req, res) => {
    const user = req.context.models.account.getUserByID(req.params.userID);

    if (user === undefined) {
        return res.status(404).send({ status: 404, response: "User not found." });
    }

    return res.status(200).send({ status: 200, response: user });
});

export default router;
