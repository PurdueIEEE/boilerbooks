import { db_conn } from './index';
import { v4 as uuidv4} from 'uuid';

const bcrypt = require('bcrypt');
const bcrypt_rounds = 10;

function getUserByID(id, res) {
    db_conn.execute(
        "SELECT email, first, last, address, city, state, zip FROM Users WHERE Users.username = ?",
        [id],
        function(err, results, fields) {
            if (err) {
                console.log('MySQL ' + err.stack);
                return res.status(500).send("Internal Server Error");
            }

            // This shouldn't ever be hit but just in case
            if (results.length === 0) {
                return  res.status(400).send("Incorrect Username");
            }

            return res.status(200).send(results[0]);
        }
    );
}

function createUser(user, res) {
    bcrypt.hash(user.pass, bcrypt_rounds, function(err, hash) {
        db_conn.execute(
            "INSERT INTO `Users` (first,last,email,address,city,state,zip,cert,username,password, passwordreset, apikey) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, '', '')",
            [user.fname, user.lname, user.email, user.address, user.city, user.state, user.zip, user.uname, hash],
            function(err, results, fields) {
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send("Username already exists");
                }
                else if(err) {
                    console.log('MySQL ' + err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                const newUser = {
                    uname: user.uname,
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                }
                return generateAPIKey(newUser, res);
            }
        );
    });
}

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
                    fname: results[0].first,
                    lname: results[0].last,
                    email: results[0].email,
                }
                return generateAPIKey(user, res);
            });
        }
    );
}

function generateAPIKey(user, res) {
    const newKey = uuidv4();

    db_conn.execute(
        "UPDATE Users SET apikeygentime = NOW(), apikey = ? WHERE username = ?",
        [newKey, user.uname],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
            }
            user.apikey = newKey;
            return res.status(201).send(user);
        }
    );
}

export default {
    getUserByID,
    createUser,
    loginUser,
}
