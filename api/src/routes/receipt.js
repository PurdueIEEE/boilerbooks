import { Router } from "express";

const router = Router();

router.get('/:file', (req, res) => {
    // TODO check to make sure that only purchaser, approvers, and treasurers can view receipts
    res.download(process.env.RECEIPT_BASEDIR + '/receipt/' + req.params.file);
});

export default router;
