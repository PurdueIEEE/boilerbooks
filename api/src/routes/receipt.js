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

import Models from "../models/index.js";
import { ACCESS_LEVEL } from "../common_items.js";
import { logger } from "../utils/logging.js";

const router = Router();

router.get("/:file", async(req, res, next) => {
    // make sure that only purchaser, approvers, and treasurers can view receipts
    const id_from_file = /.*?_(?<pnum>[0-9]+)(_reupload_[0-9]+)?\.(png|jpg|pdf|PDF|jpeg)$/gm;
    const match = id_from_file.exec(req.params.file);
    if (match === null || match.groups.pnum === undefined || match.groups.pnum === null) {
        res.status(404).send("Receipt not found");
        return next();
    }

    try {
        // oh boy this sure is a great way to do it
        // --- this solves a race condition where res.download(..) needs a callback
        //       to run when the download finishes. But since it's asynchronous,
        //       the rest of the code would continue running meaning the other checks would execute.
        //       this can cause 404, 500, or other crashes.
        //       By moving it to a for loop that we can 'break', we only do the download once and avoid
        //       most chances for a race condition.
        for (let i=0; i<1; i++) {
            const [results]  = await Models.purchase.getFullPurchaseByID(match.groups.pnum);
            if (results.length === 0) {
                res.status(404).send("Receipt not found");
                return next();
            }
            // user is purchaser
            if (results[0].username === req.context.request_user_id) {
                break;
            }
            const [results_1]  = await Models.account.getUserApprovals(req.context.request_user_id, results[0].committee, ACCESS_LEVEL.internal_leader);
            if (results_1.length === 0) {
                res.status(404).send("Receipt not found");
                return next();
            }
            // user has approval power for committee
            break;
        }
        res.status(200).sendFile(process.env.RECEIPT_BASEDIR + "/receipts/" + req.params.file, (err) => {
            if (err) {
                logger.error(err);
                if (!res.headersSent) res.status(500).send("Internal Server Error");
            }
            return next();
        });
    } catch (err) {
        logger.error(err);
        if (!res.headersSent) res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
