import { Router } from "express";

const router = Router();

router.get("/treasurers", async (req, res) => {
    try {
        // first make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send([]);
        }
        const [results_1, fields_1] = await req.context.models.access.getTreasurers();
        return res.status(200).send(results_1);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/treasurers/:treasurer", async (req, res) => {
    try {
        // first make sure user is actually a treasurer
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            return res.status(200).send("Treasurer removed");
        }
        const [results_1, fields_1] = await req.context.models.access.removeTreasurer(req.params.treasurer);
        return res.status(200).send("Treasurer removed");
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
