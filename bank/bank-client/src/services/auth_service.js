/*
    auth_service.js
    Handles authentication with the bank server
*/
// TODO: Refactor to give better names

import axios from 'axios';

/* Constants */
const SERVER_URI = "http://localhost:3001/api/";
const AUTH_URI = SERVER_URI + "token-auth";
const RESOLVE_URI = SERVER_URI + "token-resolve";
const TERMINATE_URI = SERVER_URI + "token-terminate";

/* Operations */

/**
 * Gets a user's information with the existing token.
 * @param {*} id 
 * @returns Promise. Resolves to give user info if success.
 */
const user_getinfo = async() => {
    return axios
    .get(RESOLVE_URI, { withCredentials: true })
    .then(response => {
        return response.data;
    });
};

/**
 * Logs a user in.
 * @param {Object} user 
 * @returns Promise. Resolves to give user info and set cookie if success.
 */
const user_login = async(user) => {
    if (!user.username || !user.password)
        return Promise.reject({ "error": "No username or password attribute provided" });
    
    return axios
    .post(AUTH_URI, user, { withCredentials: true })
    .then(response => {
        return response.data;
    });
};

//TODO: Store current user as cookie client-side, so we don't need to pass the ID
/**
 * Logs the current user out
 * @param {number} id The user's id
 * @returns 
 */
const user_logout = async(id) => {
    return axios.post(TERMINATE_URI, id, { withCredentials: true });
}

const exports = { user_getinfo, user_login, user_logout };

export default exports;