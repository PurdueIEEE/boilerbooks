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
import { logger } from "../utils/logging.js";

const router = Router();

router.get("/committees", async(req, res, next) => {
    try {
        const [results] = await Models.infra.getAllCommittees();
        res.status(200).send(results);
    } catch (err) {
        logger.err(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

export default router;
