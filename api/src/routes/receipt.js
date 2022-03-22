/*
   Copyright 2022 Purdue IEEE and Hadi Ahmed

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { Router } from "express";
import { logger } from "../common_items.js";

const router = Router();

router.get("/:file", async(req, res, next) => {
    // make sure that only purchaser, approvers, and treasurers can view receipts
    const id_from_file = /.*?_(?<pnum>[0-9]+)(_reupload_[0-9]+)?\.(png|jpg|pdf|jpeg)$/gm;
    const match = id_from_file.exec(req.params.file);
    if (match === null || match.groups.pnum === undefined || match.groups.pnum === null) {
        res.status(404).send("Receipt not found");
        return next();
    }

    try {
        const [results]  = await req.context.models.purchase.getFullPurchaseByID(match.groups.pnum);
        if (results.length === 0) {
            res.status(404).send("Receipt not found");
            return next();
        }
        // user is purchaser
        if (results[0].username === req.context.request_user_id) {
            res.status(200).download(process.env.RECEIPT_BASEDIR + "/receipts/" + req.params.file);
            return next();
        }
        const [results_1]  = await req.context.models.account.getUserApprovals(req.context.request_user_id, results[0].committee);
        if (results_1.length === 0) {
            res.status(404).send("Receipt not found");
            return next();
        }
        // user has approval power for committee
        res.status(200).download(process.env.RECEIPT_BASEDIR + "/receipts/" + req.params.file);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
