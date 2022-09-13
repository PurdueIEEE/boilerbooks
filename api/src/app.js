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

// Import libraries
import { Router } from "express";

// Import files
import routes from "./routes/index.js";

// Create Express
const app = Router();

// Setup our routes
app.use("/account", routes.account);
app.use("/budgets", routes.budgets);
app.use("/purchase", routes.purchase);
app.use("/committee", routes.committee);
app.use("/receipts", routes.receipt);
app.use("/income", routes.income);
app.use("/access", routes.access);
app.use("/dues", routes.dues);
app.use("/login", routes.login);
app.use("/oidc", routes.oidc);


export default app;
