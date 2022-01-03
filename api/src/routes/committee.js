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
    'ge':['GE', 'Growth & Engagement'],
    'mtt-s':['MTT-S', 'MTT-S'],
    'professional':['Professional', 'Industrial Relations'],
    'learning':['Learning', 'Learning'],
    'racing':['Racing', 'Racing'],
    'rov':['ROV', 'ROV'],
    'social':['Social', 'Social'],
    'soga':['SOGA', 'SOGA'],
};

router.get('/', (req, res) => {
    // literally just gets a list of committees
    return res.status(200).send(committees);
});

router.get('/:commKey/categories', async (req, res) => {
    // commKey must be one of the above values, that is in the DB
    if(!(req.params.commKey in committees)) {
        return res.status(404).send("Invalid committee value");
    }

    try {
        const [results, fields] = await req.context.models.committee.getCommitteeCategories(committees[req.params.commKey][0]);
        return res.status(200).send(results);
    } catch (err) {
        console.log('MySQL ' + err.stack);
        return res.status(500).send("Internal Server Error");
    }


});

router.get('/:commID/purchases', (req, res) => {
    return res.status(200).send("TODO eventually");
});

export default router
