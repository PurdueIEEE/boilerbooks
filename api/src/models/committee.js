const COMMITTEES =
{
    'general': '1',
    'aerial': '2',
    'csociety': '3',
    'embs': '4',
    'g-and-e': '5',
    'mtt-s': '6',
    'ir': '7',
    'learning': '8',
    'racing': '9',
    'rov': '10',
    'social': '11',
    'soga': '12',
}

function getCommitteeFromID(id) {
    for(let key in COMMITTEES) {
        if(COMMITTEES[key] === id) {
            return key
        }
    }

    return undefined;
}

function getIDFromCommittee(committee) {
    if(committee in COMMITTEES) {
        return COMMITTEES[committee];
    }

    return undefined;
}

export default {
    getCommitteeFromID,
    getIDFromCommittee,
}
