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
router.post("/:comm", async (req, res) => {
    if (!(req.params.comm in committee_lut)) {
        return res.status(404).send("Invalid committee value");
    }

    if (req.body === undefined || req.body.length === 0) {
        return res.status(400).send("No budget items included");
    }

    // First check the user has approval permissions
    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, committee_lut[req.params.comm][0]);
        if (results.length === 0) {
            return res.status(404).send("Invalid committee value");
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    // Clear the old budget from the database
    try {
        const [results, fields] = await req.context.models.budgets.clearBudget(committee_lut[req.params.comm][0], current_fiscal_year);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    // Add all the new line items
    try {
        for (let item of req.body) {
            if (item.category === undefined || item.amount === undefined) {
                return res.status(400).send("Budget item(s) not complete");
            }
            if (item.category === '' || item.amount === '') {
                return res.status(400).send("Budget item(s) not complete");
            }

            let budget = {
                category: item.category,
                amount: item.amount,
                committee: committee_lut[req.params.comm][0],
                year: current_fiscal_year,
            }

            const [results, fields] = await req.context.models.budgets.addBudget(budget);
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    return res.status(200).send("Budget submitted for approval");
});

export default router;
