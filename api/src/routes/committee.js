import { Router } from "express";

const router = Router();

// holy SHIT so this is the best solution I can come up with
//  with out a database schema migration. Here is the problem:
//  the committee column in the database is an enum with some values,
//  but the name of the committee does not match the enum value.
//  Further, the name of the committee is not a http safe thing to put in a URL.
//  Therefore, this is a lookup table of sorts to cross reference these
//  three different names for THE SAME COMMITEE
// format = { http-name: [ db enum, committee name ] }
const committees =
{
    'general':['General IEEE', 'General IEEE'],
    'aerial':['Aerial Robotics', 'Aerial Robotics'],
    'csociety':['Computer Society', 'Computer Society'],
    'embs':['EMBS', 'EMBS'],
    'mtt-s':['MTT-S', 'MTT-S'],
    'professional':['Professional', 'Industrial Relations'],
    'learning':['Learning', 'Learning'],
    'racing':['Racing', 'Racing'],
    'rov':['ROV', 'ROV'],
    'social':['Social', 'Social'],
    'soga':['SOGA', 'SOGA'],
    'ge':['GE', 'Growth & Engagement'],
};

router.get('/', (req, res) => {
    // literally just gets a list of committees
    return res.status(200).send(committees);
});

router.get('/:commKey/categories', (req, res) => {
    // commKey must be one of the above values, that is in the DB
    if(!(req.params.commKey in committees)) {
        return res.status(404).send("Invalid committee value");
    }

    req.context.models.committee.getCommitteeCategories(committees[req.params.commKey][0], res);
});

router.get('/:commID/purchases', (req, res) => {
    const user = req.context.models.account.getUserByID(req.context.request_user_id);

    if(user === undefined) {
        return res.status(400).send({ status: 400, response:"Improper Request Format." });
    }

    const committee = req.context.models.committee.getCommitteeFromID(req.params.commID);

    if(committee === undefined) {
        return res.status(404).send({ status: 404, response:"Committee not found." });
    }

    if(!user.approver_permission[committee] ||
        !user.treasurer_permission) {
        return res.status(403).send({ status:403, response:"Improper view permissions" });
    }

    const purchases = req.context.models.purchase.getPurchaseByCommittee(req.params.commID);
    return res.status(200).send({ status:200, response:purchases });
});

export default router
