import { Router } from "express";
import { logger } from "../common_items";

const router = Router();

router.get("/:file", async(req, res) => {
    // make sure that only purchaser, approvers, and treasurers can view receipts
    const id_from_file = /.*?_(?<pnum>[0-9]+)(_reupload_[0-9]+)?\.(png|jpg|pdf|jpeg)$/gm;
    const match = id_from_file.exec(req.params.file);
    if (match === null || match.groups.pnum === undefined || match.groups.pnum === null) {
        return res.status(404).send("Receipt not found");
    }

    try {
        const [results, _]  = await req.context.models.purchase.getFullPurchaseByID(match.groups.pnum);
        if (results.length === 0) {
            return res.status(404).send("Receipt not found");
        }
        // user is purchaser
        if (results[0].username === req.context.request_user_id) {
            return res.download(process.env.RECEIPT_BASEDIR + "/receipt/" + req.params.file);
        }
        const [results_1, _]  = await req.context.models.account.getUserApprovals(req.context.request_user_id, results[0].committee);
        if (results_1.length === 0) {
            return res.status(404).send("Receipt not found");
        }
        // user has approval power for committee
        return res.download(process.env.RECEIPT_BASEDIR + "/receipt/" + req.params.file);
    } catch (err) {
        logger.error(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
