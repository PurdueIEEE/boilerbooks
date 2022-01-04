import { Router } from 'express';

const router = Router();

// ---------------------------
// Start unauthenticated endpoints
//  cannot be async because of bcrypt
// ---------------------------

router.post('/', async (req, res) => {
    if (req.body.uname === undefined || req.body.uname === '' ||
        req.body.pass === undefined || req.body.pass === '') {
        return res.status(400).send("Fill out login details");
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

export default router;
