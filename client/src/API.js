/*
This file will contain all the BoilerBooks API endpoints.
*/

const API_PREFIX = "http://10.0.1.75/boilerbooks/api";

// Destructured/named parameters defaulted to this function will throw an
// error if that parameter is missing. (Instead of marking optional/null).
function required() {
    throw new Error('missing parameter');
}

function apiFetch(method, route, data) {
    const options = {
        method: method,
        credentials: 'include'
    }

    if (data !== undefined) {
        options.body = JSON.stringify(data)
    }

    return fetch(`${API_PREFIX}${route}`, options)
        .then(res => res.json())
}

export class Authenticate {

    static authenticate({username = required(), password = required()} = {}) {
        return apiFetch('POST', `/authenticate/${username}`, arguments[0])
    }

    static revoke({username = required()} = {}) {
        return apiFetch('DELETE', `/authenticate/${username}`, arguments[0])
    }
}

export class User {

    static add({username = required(), password = required(), first = required(),
        last = required(), email = required(), address = required(), city = required(),
        state = required(), zip = required(), cert = required()} = {}) {
        return apiFetch('POST', `/user/${username}`, arguments[0])
    }

    static remove({username = required()} = {}) {
        return apiFetch('DELETE', `/user/${username}`, arguments[0])
    }

    // FIXME: It's likely possible to auto-object the method params,
    // and then filter out null defaults to pass that to the server.
    static update({username = required(), password, first, last, email,
        address, city, state, zip} = {}) {
        return apiFetch('PATCH', `/user/${username}`, arguments[0])
    }

    static view({username = required()} = {}) {
        return apiFetch('GET', `/user/${username}`)
    }

    // FIXME: GET request can't have a body so data, must be passed in as query params
    static search({} = {}) {
        return apiFetch('GET', `/users`)
    }

    static uploadCert({username = required(), file = required()}) {
        let data = new FormData()
        data.append('certificate', file)

        return fetch(`${API_PREFIX}/user/${username}/certificate`, {
            method: 'POST',
            credentials: 'include',
            body: data
        })
        .then(res => res.json());
    }

    static certificateLink({username = required()}) {
        return `${API_PREFIX}/user/${username}/certificate`;
    }
}

export class Organization {

    static add({name = required(), parent} = {}) {
        return apiFetch('POST', `/organization/${name}`, arguments[0])
    }

    static remove({name = required()} = {}) {
        return apiFetch('REMOVE', `/organization/${name}`, arguments[0])
    }

    // FIXME: GET request can't have a body so data, must be passed in as query params
    static search() {
        // GET request can't have a body, must be passed in as query params
        return apiFetch('GET', `/organizations`)
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
