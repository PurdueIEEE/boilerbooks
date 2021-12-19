let users = {
    '1': {
        id: '1',
        fname: "Purdue",
        lname: "Pete",
        uname: "ppete",
        email: "test1@example.com",
    },
    '2': {
        id: '2',
        fname: "Mitch",
        lname: "Daniels",
        uname: "mdaniels",
        email: "test2@example.com",
    },
    '3': {
        id: '3',
        fname: "Third",
        lname: "Person",
        uname: "tperson",
        email: "test3@example.com",
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
