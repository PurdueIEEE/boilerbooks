import { Router } from "express";

const router = Router();

router.get('/:file', (req, res) => {
    res.download(process.env.RECEIPT_BASEDIR + '/receipt/' + req.params.file);
});

export default router;
