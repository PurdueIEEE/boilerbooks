import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.status(405).send("Not allowed to GET");
})


export default router;
