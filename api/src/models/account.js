let users = {
    '1': {
        id: '1',
        fname: "Purdue",
        lname: "Pete",
        uname: "ppete",
        email: "test1@example.com",
        approver_permission:
        {
            'general': true,
            'aerial': true,
            'csociety': true,
            'embs': true,
            'g-and-e': true,
            'mtt-s': true,
            'ir': true,
            'learning': true,
            'racing': true,
            'rov': true,
            'social': true,
            'soga': true
        },
        officer_permission: true,
        treasurer_permission: true,
    },
    '2': {
        id: '2',
        fname: "Mitch",
        lname: "Daniels",
        uname: "mdaniels",
        email: "test2@example.com",
        approver_permission:
        {
            'general': true,
            'aerial': true,
            'csociety': false,
            'embs': false,
            'g-and-e': false,
            'mtt-s': false,
            'ir': false,
            'learning': false,
            'racing': false,
            'rov': false,
            'social': false,
            'soga': false
        },
        officer_permission: false,
        treasurer_permission: false,
    },
    '3': {
        id: '3',
        fname: "Third",
        lname: "Person",
        uname: "tperson",
        email: "test3@example.com",
        approver_permission:
        {
            'general': true,
            'aerial': true,
            'csociety': false,
            'embs': false,
            'g-and-e': false,
            'mtt-s': false,
            'ir': false,
            'learning': false,
            'racing': false,
            'rov': false,
            'social': false,
            'soga': false
        },
        officer_permission: false,
        treasurer_permission: false,
    }
};

function getUserByID(id) {
    if (id in users) {
        return users[id];
    }

    return undefined;
}

function createUser(id, user) {
    users[id] = user;
}

export default {
    getUserByID,
    createUser,
}
