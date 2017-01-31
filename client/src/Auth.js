import cookie from 'react-cookie'
import {Authenticate} from './API.js';

const TOKEN_COOKIE = "BOILERBOOKS-JWT"

export function login(username, password) {
    return Authenticate.authenticate({username, password})
}

export function getToken() {
    return cookie.load(TOKEN_COOKIE)
}

export function loggedIn() {
    return cookie.load(TOKEN_COOKIE) !== undefined
}

export function logout() {
    if (loggedIn()) {
        return cookie.remove(TOKEN_COOKIE)
    }
}
