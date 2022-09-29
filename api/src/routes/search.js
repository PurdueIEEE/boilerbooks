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
import { fiscal_year_lut } from "../common_items.js";

import Models from "../models/index.js";

const router = Router();

/*
    Performs an advanced search
    TODO this route performs no request body validation
*/
router.post("/", async(req, res, next) => {
    req.body.fiscalyear = fiscal_year_lut[req.body.fiscalyear] !== undefined ? fiscal_year_lut[req.body.fiscalyear] : 'any';
    const [results] = await Models.search.search(req.body);

    res.status(201).send(results);
    return next();
});

export default router;
