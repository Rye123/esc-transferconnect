/*
    users-handler.js
    Handles interaction with the users database
*/
// TODO: Refactor to give better names

import axios from 'axios';

/* Constants */
const SERVER_URI = "http://localhost:3001/api/";
const USERS_URI = SERVER_URI + "users";
const AUTH_URI = SERVER_URI + "token-auth";
const RESOLVE_URI = SERVER_URI + "token-resolve";
const TERMINATE_URI = SERVER_URI + "token-terminate";

/* Operations */

/**
 * Gets a user's information with the existing token.
 * @param {*} id 
 * @returns Promise that resolves to give the information if request was successful
 */
const get_user_with_token = async() => {
    return axios.get(RESOLVE_URI, { withCredentials: true });
};

/**
 * Authenticates a user
 * @param {Object} user 
 * @returns Promise that resolves to give the assigned token if login was successful
 */
const authenticate = async(user) => {
    if (!user.username || !user.password)
        return Promise.reject({ "error": "No username or password attribute provided" });
    return axios.post(AUTH_URI, user, { withCredentials: true });
};

const logout = async(id) => {
    return axios.post(TERMINATE_URI, id, { withCredentials: true });
}

const exports = { get_user_with_token, authenticate, logout };

export default exports;