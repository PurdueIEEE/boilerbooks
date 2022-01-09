import { db_conn } from './index';
import { ACCESS_LEVEL } from '../common_items';
import { v4 as uuidv4} from 'uuid';

const bcrypt = require('bcrypt');
const bcrypt_rounds = 10;

async function getUserByID(id) {
    return db_conn.promise().execute(
        "SELECT email, first, last, address, city, state, zip FROM Users WHERE Users.username = ?",
        [id]
    );
}

async function updateUser(user) {
    return db_conn.promise().execute(
        "UPDATE Users SET modifydate=NOW(), first=?, last=?, email=?, address=?, city=?, state=?, zip=? WHERE username=?",
        [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname]
    );
}

async function getUserApprovals(user, committee) {
    return db_conn.promise().execute(
        "SELECT username, committee FROM approval WHERE committee = ? AND username = ?",
        [committee, user]
    );
}

async function getUserTreasurer(user) {
    return db_conn.promise().execute(
        `SELECT COUNT(U3.username) as validuser FROM Users U3
        INNER JOIN approval A ON U3.username = A.username
        WHERE A.role >= ? AND U3.username = ?`,
        [ACCESS_LEVEL.treasurer, user]
    );
}

// Cannot be a promise because of bcrypt
function createUser(user, res) {
    bcrypt.hash(user.pass, bcrypt_rounds, function(err, hash) {
        db_conn.execute(
            "INSERT INTO Users (first,last,email,address,city,state,zip,cert,username,password, passwordreset, apikey) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '', '')",
            [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname, hash],
            function(err, results, fields) {
                if(err && err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send("Username already exists");
                }
                else if(err) {
                    console.log('MySQL ' + err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                const newUser = {
                    uname: user.uname,
                }
                return getUserAccessLevel(newUser, res);
            }
        );
    });
}

// Cannot be a promise because of bcrypt
function loginUser(userInfo, res) {
    db_conn.execute(
        "SELECT password, email, first, last FROM Users WHERE Users.username = ?",
        [userInfo.uname],
        function(err, results, fields) {
            if (err) {
                console.log('MySQL ' + err.stack);
                return res.status(500).send("Internal Server Error");
            }

            if (results.length === 0) {
                return  res.status(400).send("Incorrect Username or Password");
            }

            bcrypt.compare(userInfo.pass, results[0].password, function (err, result) {
                if (!result) {
                    return res.status(400).send("Incorrect Username or Password");
                }

                const user = {
                    uname: userInfo.uname,
                }
                return getUserAccessLevel(user, res);
            });
        }
    );
}

// cannot be a promise because of bcrypt
function updatePassword(user, res) {
    bcrypt.hash(user.pass, bcrypt_rounds, function(err, hash) {
        db_conn.execute(
            "UPDATE Users SET modifydate=NOW(), password=? WHERE username=?",
            [hash, user.uname],
            function(err, results, fields) {
                if(err) {
                    console.log('MySQL ' + err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                return res.status(200).send("Password Updated");
            }
        );
    });
}

// Private method only used here
function getUserAccessLevel(user, res) {
    db_conn.execute(
        "SELECT MAX(A.amount) AS maxAmount, MAX(A.privilege_level) AS maxPrivilege FROM approval A WHERE A.username = ? AND A.privilege_level > ?",
        [user.uname, ACCESS_LEVEL.member],
        function (err, results, fields) {
            if (err) {
                console.log("MySQL " + err.stack);
                return res.status(500).send("Internal Server Error");
            }
            // user.viewFinancials: Expected Donations, View Financials
            // user.viewApprove: Approve Purchases
            // user.viewOfficer: View Committee Dues, Committee Budgets
            // user.viewTreasurer: Reimburse Purchases, View Income, Add Dues, Adjust Access Roles
            if (results[0].maxPrivilege !== null) {
                user.viewFinancials = true;
                user.viewApprove = results[0].maxAmount > 0;
                user.viewOfficer = results[0].maxPrivilege >= ACCESS_LEVEL.officer;
                user.viewTreasurer = results[0].maxPrivilege >= ACCESS_LEVEL.treasurer;
            } else {
                user.viewFinancials = false;
                user.viewApprove = false;
                user.viewOfficer = false;
                user.viewTreasurer = false;
            }

            return generateAPIKey(user, res);
        }
    );
}

// Private method only used here
function generateAPIKey(user, res) {
    const newKey = uuidv4(); // UUIDs are not strictly great api keys
                             //  but they are good enough for our purposes
    db_conn.execute(
        "UPDATE Users SET apikeygentime = NOW(), apikey = ? WHERE username = ?",
        [newKey, user.uname],
        function (err, results, fields) {
            if (err) {
                console.log("MySQL " + err.stack);
                return res.status(500).send("Internal Server Error");
            }
            res.cookie('apikey', newKey, { maxAge:1000*60*60*24}); // cookie is valid for 24 hours
            return res.status(201).send(user);
        }
    );
}

export default {
    getUserByID,
    createUser,
    loginUser,
    updateUser,
    updatePassword,
    getUserApprovals,
    getUserTreasurer
}
