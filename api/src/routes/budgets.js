import { Router } from 'express';

const router = Router();

router.all('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
})


export default router;
