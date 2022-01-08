import { Router } from 'express';
import multer from 'multer';
import * as fs from 'fs/promises';

import { clean_input_encodeurl, unescape_object, committee_name_swap } from '../common_items';

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
    limits:{fileSize:2*1024*1024}, // 2 MB
    dest:'/tmp/boilerbooks-tmp', // Files are just stored here while we process them
    fileFilter: fileFilter,
});

const router = Router();

router.post('/new', async (req, res) => {
    if (req.body.committee === undefined ||
        req.body.price === undefined ||
        req.body.item === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.comments === undefined ||
        req.body.category === undefined) {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.committee === '' ||
        req.body.price === '' ||
        req.body.item === '' ||
        req.body.vendor === '' ||
        req.body.reason === '' ||
        req.body.category === '') {
        return res.status(400).send("All purchase details must be completed");
    }

    // escape user input
    req.body.price = clean_input_encodeurl(req.body.price);
    req.body.item = clean_input_encodeurl(req.body.item);
    req.body.vendor = clean_input_encodeurl(req.body.vendor);
    req.body.reason = clean_input_encodeurl(req.body.reason);
    req.body.comments = clean_input_encodeurl(req.body.comments);
    req.body.category = clean_input_encodeurl(req.body.category);

    // can't escape committe so check for committee name first
    if(committee_name_swap[req.body.committee] === undefined) {
        return res.status(400).send("Committee must be proper value");
    }

    const purchase = {
        user: req.context.request_user_id,
        committee: req.body.committee,
        price: req.body.price,
        item: req.body.item,
        vendor: req.body.vendor,
        reason: req.body.reason,
        comments: req.body.comments,
        category: req.body.category,
    };

    /** Create the purchase request **/
    try {
        const [results, fields] = await req.context.models.purchase.createNewPurchase(purchase);
        if (results.affectedRows === 0) {
            return res.status(400).send("Purchase cannot be created, try again later");
        }
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    /** Get names of approvers and send back to user **/
    return res.status(201).send("Purchase request submitted, approval email not send");

    /** Send an email to approvers **/

});

router.post('/treasurer', async (req, res) => {
    if (req.body.status === undefined || req.body.status === '' ||
        req.body.idList === undefined || req.body.idList === '') {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.status !== 'Processing Reimbursement' && req.body.status !== 'Reimbursed') {
        return res.status(400).send("Purchase status must be 'Processing Reimbursement' or 'Reimbursed'");
    }

    if ((req.body.idList.match(/^(?:\d[,]?)+$/)).length === 0) {
        return res.status(400).send("ID list must be a comma seperated list of numbers")
    }

    // Check that user is treasurer
    try {
        const [results, fields] = await req.context.models.account.getUserTreasurer(req.context.request_user_id);
        if (results.length === 0) {
            return res.status(200).send("Purchase(s) updated"); // silently fail on no authorization
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    /** parse each ID **/
    const commaIDlist = req.body.idList.split(',');
    try {
        for (let id of commaIDlist) {
            /** Update the purchase **/
            const [results, fields] = await req.context.models.purchase.reimbursePurchases(id, req.body.status);
            if (results.affectedRows === 0) {
                return res.status(400).send("One or more purchase IDs are not currenty 'Purchased' or 'Processing Reimbursement'");
            }
        }
    } catch(err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    res.status(201).send("Purchase(s) updated");

    /** Send email to purchaser **/
});

router.get('/:purchaseID', async (req, res) => {

    /** get the basic params to check access control **/
    try {
        const [results, fields] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // No purchase found
        if (results.length === 0) {
            return res.status(404).send("Purchase not found");
        }
        // User is purchaser
        if (req.context.request_user_id === results[0].username) {
            results[0].committee = committee_name_swap[results[0].committee];
            return res.status(200).send(unescape_object(results[0]));
        }

        const [results_1, fields_1] = await req.context.models.account.getUserApprovals(req.context.request_user_id, results[0].committee);

        // No approval powers for committee
        if (results_1.length === 0) {
            return res.status(404).send("Purchase not found");
        }

        // Approval powers found
        return res.status(200).send(unescape_object(results[0]));

    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete('/:purchaseID', async (req, res) => {
    // check that the user has approval power first
    try {
        const [results, fields] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // Make sure purchase exists and belongs to user
        if (results.length === 0 || results[0].username !== req.context.request_user_id) {
            return res.status(404).send("Purchase not found");
        }
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    // Actually 'delete' the purchase
    try {
        const [results, fields] = await req.context.models.purchase.cancelPurchase(req.params.purchaseID);
        if (results.affectedRows === 0) {
            return res.status(400).send("Purchase status is not 'Requested', 'Approved', 'Purchased'");
        }
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    return res.status(200).send("Purchase canceled");
});

router.post('/:purchaseID/approve', async (req, res) => {
    if (req.body.price === undefined ||
        req.body.item === undefined ||
        req.body.vendor === undefined ||
        req.body.reason === undefined ||
        req.body.comments === undefined ||
        req.body.fundsource === undefined ||
        req.body.status ===  undefined ||
        req.body.committee === undefined) {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.price === '' ||
        req.body.item === '' ||
        req.body.vendor === '' ||
        req.body.reason === '' ||
        req.body.fundsource === '' ||
        req.body.status === '' ||
        req.body.committee === '') {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.status !== 'Approved' && req.body.status !== 'Denied') {
        return res.status(400).send("Purchase status must be 'Approved' or 'Denied'");
    }
    if (req.body.fundsource !== 'BOSO' && req.body.fundsource !== 'Cash' && req.body.fundsource !== 'SOGA') {
        return res.status(400).send("Purchase funding source must be 'BOSO' or 'Cash' or 'SOGA'");
    }

    // escape user input
    req.body.price = clean_input_encodeurl(req.body.price);
    req.body.item = clean_input_encodeurl(req.body.item);
    req.body.vendor = clean_input_encodeurl(req.body.vendor);
    req.body.reason = clean_input_encodeurl(req.body.reason);
    req.body.comments = clean_input_encodeurl(req.body.comments);

    // can't escape committe so check for committee name first
    req.body.committee = Object.keys(committee_name_swap).find(key => committee_name_swap[key] === req.body.committee);
    if(!(req.body.committee in committee_name_swap)) {
        return res.status(400).send("Committee must be proper value");
    }

    // check that the user has approval power first
    try {
        const [results, fields] = await req.context.models.account.getUserApprovals(req.context.request_user_id, req.body.committee);
        // No approval powers for committee
        if (results.length === 0) {
            return res.status(404).send("Purchase not found");
        }
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    const purchase = {
        id: req.params.purchaseID,
        approver: req.context.request_user_id,
        item: req.body.item,
        vendor: req.body.vendor,
        reason: req.body.reason,
        cost: req.body.price,
        status: req.body.status,
        comments: req.body.comments,
        fundsource: req.body.fundsource,
    };

    /** update request **/
    try{
        const [results, fields] = await req.context.models.purchase.approvePurchase(purchase);
        if (results.affectedRows === 0) {
            return res.status(400).send("Purchase not found or not in 'Requested' status");
        }
    } catch (err) {
        console.log("MySQL " + err.stack);
        return res.status(500).send("Internal Server Error");
    }

    res.status(201).send(`Purchase ${req.body.status}`);

    /** email requester with result **/

});

router.post('/:purchaseID/complete', fileHandler.single('receipt'), async (req, res) => {
    if (req.body.price === undefined ||
        req.body.comments === undefined ||
        req.body.purchasedate === undefined) {
        return res.status(400).send("All purchase details must be completed");
    }

    if (req.body.price === '' ||
        req.body.purchasedate === '') {
        return res.status(400).send("All purchase details must be completed");
    }

    // This catches our fileFilter filtering out files
    if (req.file === undefined) {
        return res.status(400).send("Reciept must be a PDF, JPG, or PNG");
    }

    // escape user input
    req.body.price = clean_input_encodeurl(req.body.price);
    req.body.comments = clean_input_encodeurl(req.body.comments);

    // can't escape the purchasedate, so check format instead
    if ((req.body.purchasedate.match(/^\d{4}-\d{2}-\d{2}$/)).length === 0) {
        fs.unlink(req.file.path);
        return res.status(400).send("Purchase Date must be in the form YYYY-MM-DD");
    }

    /** get the basic params to check access control **/
    try {
        const [results, fields] = await req.context.models.purchase.getFullPurchaseByID(req.params.purchaseID);
        // No purchase found
        if (results.length === 0) {
            return res.status(404).send("Purchase not found");
        }
        // User is not purchaser
        if (req.context.request_user_id !== results[0].username) {
            return res.status(400).send("Purchase not found");
        }

        /** setup file and remove the temp **/
        const fileType = req.file.mimetype.split('/')[1]; // dirty hack to get the file type from the MIME type
        let file_save_name = `${results[0].committee}_${results[0].username}_${results[0].item}_${results[0].purchaseid}.${fileType}`;
        file_save_name = file_save_name.replace(' ', '_');
        file_save_name = file_save_name.replaceAll(/['\"!?#%&{}/<>$:@+`|=]/ig, '');
        file_save_name = '/receipt/'.concat('', file_save_name);

        // check if the file already exists
        try {
            const stats = await fs.stat(file_save_name);
            if (stats.isFile()) {
                return res.status(500).send("Receipt file already exists");
            }
        } catch (err) {
            // File doesn't exist, so just continue
        }

        await fs.rename(req.file.path, process.env.RECEIPT_BASEDIR+file_save_name);

        const purchase = {
            id: req.params.purchaseID,
            purchasedate: req.body.purchasedate,
            cost: req.body.price,
            comments: req.body.comments,
            receipt: file_save_name,
        };

        const [results_1, fields_1] = await req.context.models.purchase.completePurchase(purchase);

    } catch (err) {
        console.log(err.stack);
        return res.status(500).send("Internal Server Error");
    }

    /** send email to treasurer **/

    return res.status(201).send("Purchase completed");
}, (err, req, res, next) => {
    // This catches too large files
    res.status(400).send("Reciept must be less than 2MB");
});

export default router;
