import { db_conn } from './index';

const bcrypt = require('bcrypt');
const bcrypt_rounds = 10;

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
            'general': false,
            'aerial': false,
            'csociety': true,
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
            'general': false,
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
        officer_permission: true,
        treasurer_permission: false,
    }
};

function getUserByID(id) {
    if (id in users) {
        return users[id];
    }

    return undefined;
}

async function createUser(user, res) {
    bcrypt.hash(user.pass, bcrypt_rounds, function(err, hash) {
        db_conn.execute(
            "INSERT INTO `Users` (first,last,email,address,city,state,zip,cert,username,password, passwordreset, apikey) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '', '')",
            [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname, hash],
            function(err, results, fields) {
                if(err) {
                    console.log('MySQL ' + err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                console.log('Created user ' + user.uname);
                return res.status(201).send({ status: 201, response: "User created." });
            }
        );
    });
}

export default {
    getUserByID,
    createUser,
}
