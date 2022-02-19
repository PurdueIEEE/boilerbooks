import { Router } from "express";
import { fiscal_year_list, current_fiscal_year, committee_lut } from "../common_items";

const router = Router();

/*
    Get a list of all fiscal years
*/
router.get("/years", (req, res) => {
    return res.status(200).send(fiscal_year_list);
});

/*
    Create a new budget for the current fiscal year
*/
router.post("/:comm", (req, res) => {
    if (!(req.params.comm in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    console.log(req.body);

    return res.status(200).send("ok");
})

export default router;
