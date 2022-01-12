import { Router } from "express";
import { fiscal_year_list } from "../common_items";

const router = Router();

router.get("/years", (req, res) => {
    return res.status(200).send(fiscal_year_list);
});


export default router;
