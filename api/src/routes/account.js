import { v4 as uuidv4} from 'uuid';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
});

router.head('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
});

router.put('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
});

router.delete('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
});

router.post('/', (req, res) => {
    if (req.body.fname === undefined ||
        req.body.lname === undefined ||
        req.body.uname === undefined ||
        req.body.email === undefined) {
        return res.status(400).send("All account details must be defined.");
    }

    const id = uuidv4();
    const user = {
        id,
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        email: req.body.email,
    };

    req.context.models.users[id] = user;

    return res.send(`/account/${id}`);
});

router.get('/:userID', (req, res) => {
    const user = req.context.models.users[req.params.userID];

    if (user === undefined) {
        return res.status(404).send("Account not found.");
    }

    return res.send(user);
});

export default router;
