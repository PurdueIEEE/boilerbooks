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
import multer from "multer";
import * as fs from "fs/promises";
import jimp from "jimp";

import { committee_name_swap, committee_name_api, mailer, logger, ACCESS_LEVEL } from "../common_items.js";

// filter uploaded files based on type
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "application/pdf" ) {
        cb(null, true);
    } else {
        cb(null, false);
    //return cb(new Error('Reciept must be a PDF, JPG, or PNG'));
    }
}
// create file upload handler
const fileHandler = multer({
    limits:{fileSize:5*1024*1024,}, // 2 MB
    dest:"/tmp/boilerbooks-tmp", // Files are just stored here while we process them
    fileFilter: fileFilter,
});

const router = Router();


const treasurer_status = ["Processing Reimbursement", "Reimbursed"];
const approve_status = ["Approved", "Denied"];
const approve_fundsource = ["BOSO", "Cash", "SOGA"];
const check_type = ["Pick-up", "Mailed"];

/*
    Get all processing or reimbursed purchases
*/
router.get("/", async(req, res, next) => {
    // Check that user is treasurer
    try {
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send([]); // silently fail on no authorization
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    try {
        const [results] = await req.context.models.purchase.getAllReimbursements();
        res.status(200).send(results);
        return next();
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }
});

/*
    Create new purchase
*/
router.post("/", async(req, res, next) => {
    if (req.body.committee === undefined ||
        req.body.price === undefined ||
        req.body.item === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.comments === undefined ||
        req.body.checkType === undefined||
        req.body.category === undefined) {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.committee === "" ||
        req.body.price === "" ||
        req.body.item === "" ||
        req.body.vendor === "" ||
        req.body.reason === "" ||
        req.body.checkType === "" ||
        req.body.category === "") {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.item.length > 50) {
        res.status(400).send("Item field too long");
        return next();
    }
    if (req.body.reason.length > 50) {
        res.status(400).send("Reason field too long");
        return next();
    }
    if (req.body.vendor.length > 50) {
        res.status(400).send("Vendor field too long");
        return next();
    }
    if (req.body.comments.length > 500) {
        res.status(400).send("Comments field too long");
        return next();
    }

    // can't escape committe so check for committee name first
    if (committee_name_swap[req.body.committee] === undefined) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    if (!check_type.includes(req.body.checkType)) {
        res.status(400).send("Invalid check type");
        return next();
    }

    req.body.user = req.context.request_user_id;

    /** Create the purchase request **/
    let insert_id = 0;
    try {
        const [results] = await req.context.models.purchase.createNewPurchase(req.body);
        if (results.affectedRows === 0) {
            res.status(400).send("Purchase cannot be created, try again later");
            return next();
        }
        insert_id = results.insertId;
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error: Purchase not created");
        return next();
    }

    /** Get names of approvers and send back to user **/
    let emails = "";
    try {
        const [results] = await req.context.models.purchase.getPurchaseApprovers(insert_id);

        let names = "";
        results.forEach(approver => {
            names += approver.name + ", ";
            emails += approver.email + ", ";
        });
        names = names.slice(0, -2);
        emails = emails.slice(0, -2);
        res.status(201).send(`Purchase successfully submitted!\nIt can be reviewed by: ${names}`);
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error: Purchase created but approvers not notified");
        return next();
    }

    if (process.env.SEND_MAIL !== "yes") return next(); // SEND_MAIL must be "yes" or no mail is sent
    try {
        await mailer.sendMail({
            to: emails,
            subject: `New Purchase Request for ${req.body.committee}`,
            text: `A request was made by ${req.body.user} for ${req.body.item} costing $${req.body.price}\n` +
            "Please visit Boiler Books at your earliest convenience to approve or deny the request.\n" +
            `You always view the most up-to-date status of the purchase at https://money.purdueieee.org/ui/detail-view?id=${insert_id}.\n\n` +
            "This email was automatically sent by Boiler Books",
            html: `<h2>New Purchase Request!</h2>
            <p>A request was made by ${req.body.user} for ${req.body.item} costing $${req.body.price}.</p>
            <p>Please visit <a href="https://money.purdueieee.org" target="_blank">Boiler Books</a> at your earliest convenience to approve or deny the request.</p>
            <p>You always view the most up-to-date status of the purchase <a href="https://money.purdueieee.org/ui/detail-view?id=${insert_id}">here</a>.</p>
            <br>
            <small>This email was automatically sent by Boiler Books</small>`,
        });
    } catch (err) {
        logger.error(err);
    }
    return next();
});

/*
    Mark purchases as 'Reimbursed' or 'Processing Reimbursement'
*/
router.post("/treasurer", async(req, res, next) => {
    if (req.body.status === undefined || req.body.status === "" ||
        req.body.idList === undefined || req.body.idList === "") {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (!treasurer_status.includes(req.body.status)) {
        res.status(400).send("Purchase status must be 'Processing Reimbursement' or 'Reimbursed'");
        return next();
    }

    if ((req.body.idList.match(/^(?:\d[,]?)+$/)).length === 0) {
        res.status(400).send("Purchase ID list must be a comma seperated list of numbers");
        return next();
    }

    // Check that user is treasurer
    try {
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Purchase(s) updated"); // silently fail on no authorization
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    /** parse each ID **/
    const commaIDlist = req.body.idList.split(",");
    try {
        for (let id of commaIDlist) {
            /** Update the purchase **/
            const [results] = await req.context.models.purchase.reimbursePurchases(id, req.body.status);
            if (results.affectedRows === 0) {
                res.status(400).send("One or more purchase IDs are not currenty 'Purchased' or 'Processing Reimbursement'");
                next();
            }
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Purchase(s) updated");

    /** Send email to purchasers **/
    if (process.env.SEND_MAIL !== "yes") return next(); // SEND_MAIL must be "yes" or no mail is sent
    try {
        const email_to_send_pickup = {};
        const email_to_send_mail = {};
        for (let id of commaIDlist) {
            const [purchase_deets] = await req.context.models.purchase.getFullPurchaseByID(id);
            if (purchase_deets[0].check_type === 'Mailed') {
                if (email_to_send_mail[purchase_deets[0].username] === undefined) {
                    email_to_send_mail[purchase_deets[0].username] = [purchase_deets[0].item];
                } else {
                    email_to_send_mail[purchase_deets[0].username].push(purchase_deets[0].item);
                }
            } else {
                if (email_to_send_pickup[purchase_deets[0].username] === undefined) {
                    email_to_send_pickup[purchase_deets[0].username] = [purchase_deets[0].item];
                } else {
                    email_to_send_pickup[purchase_deets[0].username].push(purchase_deets[0].item);
                }
            }
        }

        for (let username in email_to_send_pickup) {
            const [user_deets] = await req.context.models.account.getUserByID(username);
            let text = `Your purchase request(s) are now ${req.body.status}\n`;
            let html = `<h2>Your purchase request(s) are now ${req.body.status}</h2><ul>`;
            for (let purchase of email_to_send_pickup[username]) {
                text += `* ${purchase}\n`;
                html += `<li>${purchase}</li>`;
            }

            if (req.body.status === "Reimbursed") {
                text += "Please stop by BHEE 014 to pick up your check.\n\n";
                html += "</ul><p>Please stop by BHEE 014 to pick up your check</p>";
            } else {
                text += `You always view the most up-to-date status of your purchases at https://${process.env.HTTP_HOST}/ui/.\n\n`;
                html += `</ul><p>You always view the most up-to-date status of your purchases <a href="https://${process.env.HTTP_HOST}/ui/">here</a>.</p>`;
            }

            text += "This email was automatically sent by Boiler Books";
            html += "<br><small>This email was automatically sent by Boiler Books</small>";
            await mailer.sendMail({
                to: user_deets[0].email,
                subject: "Purchase Status Updated!",
                text,
                html,
            });
        }

        for (let username in email_to_send_mail) {
            const [user_deets] = await req.context.models.account.getUserByID(username);
            let text = `Your purchase request(s) are now ${req.body.status}\n`;
            let html = `<h2>Your purchase request(s) are now ${req.body.status}</h2><ul>`;
            for (let purchase of email_to_send_mail[username]) {
                text += `* ${purchase}\n`;
                html += `<li>${purchase}</li>`;
            }

            text += "You opted to mail this check to your mailing address.\n\n";
            html += "</ul><p>You opted to mail this check to your mailing address.</p>";

            if (req.body.status === "Reimbursed") {
                text += "Your check should have arrived before this email was sent.\n\n";
                html += "<p>Your check should have arrived before this email was sent.</p>";
            } else {
                text += `Please check your mailbox over the next few weeks. Make sure to mark the check as received once it arrives.\n\n`;
                html += `</ul><p>Please check your mailbox over the next few weeks. Make sure to mark the check as received once it arrives.</p>`;
            }

            text += "This email was automatically sent by Boiler Books";
            html += "<br><small>This email was automatically sent by Boiler Books</small>";
            await mailer.sendMail({
                to: user_deets[0].email,
                subject: "Purchase Status Updated!",
                text,
                html,
            });
        }
    } catch (err) {
        logger.error(err);
    }
    return next();
});

/*
    Get details of a purchase
*/
router.get("/:purchaseID", async(req, res, next) => {

    /** get the basic params to check access control **/
    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // No purchase found
        if (results.length === 0) {
            res.status(404).send("Purchase not found");
            return next();
        }

        const [results_1] = await req.context.models.account.getUserApprovals(req.context.request_user_id, results[0].committee, ACCESS_LEVEL.internal_leader);

        // No approval powers for committee
        if (results_1.length === 0) {
            // User is purchaser
            if (req.context.request_user_id === results[0].username) {
                if (results[0].status === "Requested" || results[0].status === "Approved") {
                    results[0].maxCost = parseFloat(results[0].cost) * 1.15 + 10;
                }
                results[0].committee = committee_name_swap[results[0].committee];
                results[0].committeeAPI = committee_name_api[results[0].committee];
                res.status(200).send(results[0]);
                return next();
            }
            res.status(404).send("Purchase not found");
            return next();
        }

        const [results_2] = await req.context.models.committee.getCommitteeBalance(results[0].committee);
        if (results[0].status === "Requested" || results[0].status === "Approved") {
            results[0].maxCost = parseFloat(results[0].cost) * 1.15 + 10;
        }
        results[0].committee = committee_name_swap[results[0].committee];
        results[0].committeeAPI = committee_name_api[results[0].committee];
        results[0].costTooHigh = parseFloat(results_2[0].balance) < parseFloat(results[0].cost);
        results[0].lowBalance = parseFloat(results_2[0].balance) < 200;
        // Approval powers found
        res.status(200).send(results[0]);
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
    }
    return next();
});

/*
    Allow a treasurer to edit a purchase
*/
router.put("/:purchaseID", async(req,res, next) => {
    if (req.body.cost === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.category === undefined ||
        req.body.check_type === undefined ||
        req.body.comments === undefined) {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.cost === "" ||
        req.body.vendor === "" ||
        req.body.category === "" ||
        req.body.check_type === "" ||
        req.body.reason === "") {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    try {
        // check the user is a treasurer
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            res.status(200).send("Updated Purchase");
            return next();
        }
        req.body.purchaseID = req.params.purchaseID;
        const [results_1] = await req.context.models.purchase.updatePurchase(req.body);
        if (results_1.affectedRows === 0) {
            res.status(400).send("Not able to update purchase, try again later");
            return next();
        }
        res.status(200).send("Updated purchase");
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
    }
    return next();
});

/*
    Cancel a purchase
*/
router.delete("/:purchaseID", async(req, res, next) => {
    // check that the user has approval power first
    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // Make sure purchase exists and belongs to user
        if (results.length === 0 || results[0].username !== req.context.request_user_id) {
            res.status(404).send("Purchase not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    // Actually 'delete' the purchase
    try {
        const [results] = await req.context.models.purchase.cancelPurchase(req.params.purchaseID);
        if (results.affectedRows === 0) {
            res.status(400).send("Purchase status is not 'Requested', 'Approved', 'Purchased'");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(200).send("Purchase canceled");
    return next();
});

/*
    Approve or Deny a purchase
*/
router.post("/:purchaseID/approve", async(req, res, next) => {
    if (req.body.price === undefined ||
        req.body.item === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.comments === undefined ||
        req.body.fundsource === undefined ||
        req.body.status ===  undefined ||
        req.body.committee === undefined ||
        req.body.category === undefined) {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.price === "" ||
        req.body.item === "" ||
        req.body.vendor === "" ||
        req.body.reason === "" ||
        req.body.fundsource === "" ||
        req.body.status === "" ||
        req.body.committee === "" ||
        req.body.category === "") {
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.item.length > 50) {
        res.status(400).send("Item field too long");
        return next();
    }
    if (req.body.reason.length > 50) {
        res.status(400).send("Reason field too long");
        return next();
    }
    if (req.body.vendor.length > 50) {
        res.status(400).send("Vendor field too long");
        return next();
    }
    if (req.body.comments.length > 500) {
        res.status(400).send("Comments field too long");
        return next();
    }

    if (!approve_status.includes(req.body.status)) {
        res.status(400).send("Purchase status must be 'Approved' or 'Denied'");
        return next();
    }
    if (!approve_fundsource.includes(req.body.fundsource)) {
        res.status(400).send("Purchase funding source must be 'BOSO' or 'Cash' or 'SOGA'");
        return next();
    }

    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        if (results.length === 0) {
            res.status(404).send("Purchase not found");
            return next();
        }
        if (parseFloat(req.body.price) > (parseFloat(results[0].cost) * 1.15 + 10)) {
            res.status(400).send("Purchase cost too high");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    // can't escape committe so check for committee name first
    req.body.committee = Object.keys(committee_name_swap).find(key => committee_name_swap[key] === req.body.committee);
    if (!(req.body.committee in committee_name_swap)) {
        res.status(400).send("Committee must be proper value");
        return next();
    }

    // check that the user has approval power first
    try {
        const [results] = await req.context.models.account.canApprovePurchase(req.context.request_user_id, req.params.purchaseID);
        // No approval powers for committee
        if (results.length === 0) {
            res.status(404).send("Purchase not found");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    req.body.approver = req.context.request_user_id;
    req.body.id = req.params.purchaseID;

    /** update request **/
    try {
        const [results] = await req.context.models.purchase.approvePurchase(req.body);
        if (results.affectedRows === 0) {
            res.status(400).send("Purchase not in 'Requested' status");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send(`Purchase ${req.body.status}`);

    /** email requester with result **/
    if (process.env.SEND_MAIL !== "yes") return next(); // SEND_MAIL must be "yes" or no mail is sent
    try {
        const [purchase_deets] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        const [user_deets] = await req.context.models.account.getUserByID(purchase_deets[0].username);
        await mailer.sendMail({
            to: user_deets[0].email,
            subject: "Purchase Status Updated!",
            text: `Your request for ${purchase_deets[0].item} was ${purchase_deets[0].status}\n` +
            "Please visit Boiler Books at your earliest convenience to complete the purchase.\n" +
            `You always view the most up-to-date status of the purchase at https://${process.env.HTTP_HOST}/ui/detail-view?id=${req.params.purchaseID}.\n\n` +
            "This email was automatically sent by Boiler Books",
            html: `<h2>Your Purchase Request Was ${purchase_deets[0].status}</h2>
            <p>Your request to buy <em>${purchase_deets[0].item}</em> for <em>${purchase_deets[0].committee}</em> was ${purchase_deets[0].status}</p>
            <p>Please visit <a href="https://money.purdueieee.org" target="_blank">Boiler Books</a> at your earliest convenience to complete the request.</p>
            <p>You always view the most up-to-date status of the purchase <a href="https://${process.env.HTTP_HOST}/ui/detail-view?id=${req.params.purchaseID}">here</a>.</p>
            <br>
            <small>This email was automatically sent by Boiler Books</small>`,
        });
    } catch (err) {
        logger.error(err);
    }
    return next();
});

/*
    Complete a purchase
*/
router.post("/:purchaseID/complete", fileHandler.single("receipt"), async(req, res, next) => {
    // This catches our fileFilter filtering out files
    if (req.file === undefined) {
        res.status(400).send("Reciept must be a PDF, JPG, or PNG");
        return next();
    }

    if (req.body.price === undefined ||
        req.body.comments === undefined ||
        req.body.purchasedate === undefined) {
        fs.unlink(req.file.path);
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.price === "" ||
        req.body.purchasedate === "") {
        fs.unlink(req.file.path);
        res.status(400).send("All purchase details must be completed");
        return next();
    }

    if (req.body.comments.length > 500) {
        fs.unlink(req.file.path);
        res.status(400).send("Comments field too long");
        return next();
    }

    // can't escape the purchasedate, so check format instead
    if ((req.body.purchasedate.match(/^\d{4}-\d{2}-\d{2}$/)).length === 0) {
        fs.unlink(req.file.path);
        res.status(400).send("Purchase Date must be in the form YYYY-MM-DD");
        return next();
    }

    // The format is good, so check the actual validity of the date
    // @see https://stackoverflow.com/a/62517465
    const parts = req.body.purchasedate.split("-").map((p) => parseInt(p, 10));
    parts[1] -= 1;
    const date_check = new Date(parts[0], parts[1], parts[2]);
    const date_good = (date_check.getFullYear() === parts[0]) && (date_check.getMonth() === parts[1]) && (date_check.getDate() === parts[2]);
    if (!date_good) {
        fs.unlink(req.file.path);
        res.status(400).send("Purchase Date is invalid");
        return next();
    }

    // Now that the format and validity of the date is good, make sure it's in the past
    const today = new Date();
    const today_string = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,"0")}-${(today.getDate()).toString().padStart(2,"0")}`;
    if (req.body.purchasedate > today_string) {
        fs.unlink(req.file.path);
        res.status(400).send("Purchase Date cannot be in the future");
        return next();
    }

    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        if (results.length === 0) {
            fs.unlink(req.file.path);
            res.status(404).send("Purchase not found");
            return next();
        }
        if (parseFloat(req.body.price) > (parseFloat(results[0].cost) * 1.15 + 10)) {
            fs.unlink(req.file.path);
            res.status(400).send("Purchase cost too high, create a new request if needed");
            return next();
        }
    } catch (err) {
        logger.error(err.stack);
        fs.unlink(req.file.path);
        res.status(500).send("Internal Server Error");
        return next();
    }

    /** get the basic params to check access control **/
    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // No purchase found
        if (results.length === 0) {
            fs.unlink(req.file.path);
            res.status(404).send("Purchase not found");
            return next();
        }
        // User is not purchaser
        if (req.context.request_user_id !== results[0].username) {
            fs.unlink(req.file.path);
            res.status(400).send("Purchase not found");
            return next();
        }

        /** setup file and remove the temp **/
        const fileType = req.file.mimetype.split("/")[1]; // dirty hack to get the file type from the MIME type

        let file_save_name = "";
        if (fileType === "png") {
            // BOSO only allows PDF and JPG, so handle png differently
            file_save_name = `${results[0].committee}_${results[0].username}_${results[0].item}_${results[0].purchaseid}.jpg`;
        } else {
            // handle JPG / JPEG / PDF like normal
            //  if the filetype is JPEG, change the file extension to .jpg for BOSO
            file_save_name = `${results[0].committee}_${results[0].username}_${results[0].item}_${results[0].purchaseid}.${fileType === "jpeg" ? "jpg" : fileType}`;
        }
        file_save_name = file_save_name.replaceAll(" ", "_");
        file_save_name = file_save_name.replaceAll(/['"!?#%&{}/<>$:@+`|=]/ig, "");
        file_save_name = "/receipts/".concat("", file_save_name);

        // check if the file already exists
        try {
            const stats = await fs.stat(process.env.RECEIPT_BASEDIR+file_save_name);
            if (stats.isFile()) {
                fs.unlink(req.file.path);
                res.status(500).send("Receipt file already exists");
                return next();
            }
        } catch (err) {
            // File doesn't exist, so just continue
        }

        if (fileType === "png") {
            const img = await jimp.read(req.file.path);
            img.write(process.env.RECEIPT_BASEDIR+file_save_name);
            fs.unlink(req.file.path);
        } else {
            await fs.copyFile(req.file.path, process.env.RECEIPT_BASEDIR+file_save_name);
            fs.unlink(req.file.path);
        }

        req.body.receipt = file_save_name;
        req.body.id = req.params.purchaseID;

        await req.context.models.purchase.completePurchase(req.body);

    } catch (err) {
        logger.error(err.stack);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Purchase completed");

    /** send email to treasurer **/
    if (process.env.SEND_MAIL !== "yes") return next(); // SEND_MAIL must be "yes" or no mail is sent
    try {
        const [purchase_deets ] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        await mailer.sendMail({
            to:  "purdue.ieee.treasurer@gmail.com",
            subject: `New Purchase By ${purchase_deets[0].committee}`,
            text: `${purchase_deets[0].committee} has just purchased ${purchase_deets[0].item} for $${purchase_deets[0].cost}.\n` +
            "Please visit Boiler Books at your earliest convenience to begin the reimbursement process.\n" +
            `You always view the most up-to-date status of the purchase at https://${process.env.HTTP_HOST}/ui/detail-view?id=${req.params.purchaseID}.\n\n` +
            "This email was automatically sent by Boiler Books",
            html: `<p>${purchase_deets[0].committee} has purchased ${purchase_deets[0].item} for $${purchase_deets[0].cost}</p>
            <p>Please visit <a href="https://money.purdueieee.org" target="_blank">Boiler Books</a> at your earliest convenience to begin the reimbursement process.</p>
            <p>You always view the most up-to-date status of the purchase <a href="https://${process.env.HTTP_HOST}/ui/detail-view?id=${req.params.purchaseID}">here</a>.</p>
            <br>
            <small>This email was automatically sent by Boiler Books</small>`,
        });
    } catch (err) {
        logger.error(err);
    }

    return next();
}, (err, req, res, next) => {
    // This catches too large files
    res.status(400).send("Reciept must be less than 2MB");
    return next();
});

/*
    Reupload a purchase receipt
*/
router.post("/:purchaseID/receipt", fileHandler.single("receipt"), async(req, res, next) => {
    // This catches our fileFilter filtering out files
    if (req.file === undefined) {
        res.status(400).send("Reciept must be a PDF, JPG, or PNG");
        return next();
    }

    try {
        const [results] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.validuser === 0) {
            fs.unlink(req.file.path);
            res.status(404).send("Purchase not found");
            return next();
        }
        const [results_1] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        if (results_1.length === 0) {
            fs.unlink(req.file.path);
            res.status(404).send("Purchase not found");
            return next();
        }

        /** setup file and remove the temp **/
        // Regex is fun, ask Grant Geyer what it does
        const old_file = results_1[0].receipt.match(/(?<pre>\/receipts\/[^_]+_??[^_]*?_[^_]+_.+?_[0-9]+)(_reupload_(?<reup>[0-9]))?\.(png|jpg|pdf|PDF|jpeg)/);
        const fileType = req.file.mimetype.split("/")[1]; // dirty hack to get the file type from the MIME type

        let reup_num = 1;
        if (old_file.groups.reup) {
            reup_num = parseInt(old_file.groups.reup, 10) + 1;
        }

        let file_save_name = "";
        if (fileType === "png") {
            file_save_name = `${old_file.groups.pre}_reupload_${reup_num}.jpg`;
        } else {
            file_save_name = `${old_file.groups.pre}_reupload_${reup_num}.${fileType}`;
        }

        // check if the file already exists
        try {
            const stats = await fs.stat(process.env.RECEIPT_BASEDIR+file_save_name);
            if (stats.isFile()) {
                fs.unlink(req.file.path);
                res.status(500).send("Receipt file already exists");
                return next();
            }
        } catch (err) {
            // File doesn't exist, so just continue
        }

        if (fileType === "png") {
            const img = await jimp.read(req.file.path);
            img.write(process.env.RECEIPT_BASEDIR+file_save_name);
            fs.unlink(req.file.path);
        } else {
            await fs.copyFile(req.file.path, process.env.RECEIPT_BASEDIR+file_save_name);
            fs.unlink(req.file.path);
        }

        await req.context.models.purchase.updateReceipt(req.params.purchaseID, file_save_name);

    } catch (err) {
        logger.error(err.stack);
        fs.unlink(req.file.path);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Receipt updated");
    return next();
}, (err, req, res, next) => {
    // This catches too large files
    res.status(400).send("Reciept must be less than 5 MB");
    return next();
});

/*
    Mark a check as received
*/
router.post("/:purchaseID/checks", async (req, res, next) => {
    try {
        const [results] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        if (results.length === 0) {
            res.status(404).send("Purchase not found");
            return next();
        }
        if (results[0].username !== req.context.request_user_id) {
            res.status(404).send("Purchase not found");
            return next();
        }

        if (results[0].check_type !== 'Mailed') {
            res.status(400).send("Check was not mailed");
            return next();
        }

        if (results[0].status !== 'Processing Reimbursement') {
            res.status(400).send("Check was not mailed");
            return next();
        }

        await req.context.models.purchase.markReceived(req.params.purchaseID);

    } catch (err) {
        logger.error(err.stack);
        fs.unlink(req.file.path);
        res.status(500).send("Internal Server Error");
        return next();
    }

    res.status(201).send("Check marked as recieved");
    return next();
});

export default router;
