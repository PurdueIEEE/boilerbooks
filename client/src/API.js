/*
This file will contain all the BoilerBooks API endpoints.
*/

const API_PREFIX = "http://devmoney.krakos.net/api/";

// Destructured/named parameters defaulted to this function will throw an
// error if that parameter is missing. (Instead of marking optional/null).
function required() {
    throw new Error('missing parameter');
}

// This accessor function relies on the auth token being stored in localStorage.
function token() {
    return localStorage.token || '';
}

export class Authenticate {

    static authenticate({username = required(), password = required()} = {}) {
        return fetch(API_PREFIX + "authenticate/" + username, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static revoke({username = required()} = {}) {
        return fetch(API_PREFIX + "authenticate/" + username, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }
}

export class User {

    static add({username = required(), password = required(), first = required(),
        last = required(), email = required(), address = required(), city = required(),
        state = required(), zip = required(), cert = required()} = {}) {
        return fetch(API_PREFIX + "user/" + username, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static remove({username = required()} = {}) {
        return fetch(API_PREFIX + "user/" + username, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    // FIXME: It's likely possible to auto-object the method params,
    // and then filter out null defaults to pass that to the server.
    static update({username = required(), password, first, last, email,
        address, city, state, zip} = {}) {
        return fetch(API_PREFIX + "user/" + username, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static view({username = required()} = {}) {
        return fetch(API_PREFIX + "user/" + username, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static search({} = {}) {
        return fetch(API_PREFIX + "users", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }
}

export class Organization {

    static add({name = required(), parent} = {}) {
        return fetch(API_PREFIX + "organization" + name, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static remove({name = required()} = {}) {
        return fetch(API_PREFIX + "organization/" + name, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }

    static search() {
        return fetch(API_PREFIX + "organizations", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
    }
}

export class Rights {

}

export class Purchase {

}

export class Budget {

}

export class Income {

}
