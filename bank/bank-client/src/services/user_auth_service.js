/*
    auth_service.js
    Handles authentication with the bank server
*/

import axios from 'axios';
import User from '../classes/User';

/* Constants */
const SERVER_URI = "/api/";
const AUTH_URI = SERVER_URI + "user-token-auth";             // URI for authentication and token saving
const RESOLVE_URI = SERVER_URI + "user-token-resolve";       // URI for resolving the token and getting user information
const TERMINATE_URI = SERVER_URI + "user-token-terminate";   // URI for terminating the session


/* Operations */

/**
 * Gets a user's information with the existing token.
 * @returns Promise. Resolves to give user info if success.
 */
const user_getinfo = async () => {
    return axios
        .get(RESOLVE_URI, { withCredentials: true })
        .then(response => {
            const data = response.data;
            return new User(
                data.userId,
                data.username,
                data.firstName,
                data.lastName,
                data.points,
                data?.userSettings || {}
            );
        });
};

/**
 * Logs a user in.
 * @param {{username: string, password: string}} credentials 
 * @returns Promise. Resolves to give user info and set cookie if success.
 */
const user_login = async (credentials) => {
    if (!credentials.username || !credentials.password)
        return Promise.reject({ "error": "No username or password attribute provided" });

    return axios
        .post(AUTH_URI, credentials, { withCredentials: true })
        .then(() => {
            return user_getinfo();
        });
};

/**
 * Logs the current user out
 * @returns Promise. Session is ended upon promise resolution.
 */
const user_logout = async () => {
    return axios.post(TERMINATE_URI, {}, { withCredentials: true });
}

const exports = { user_getinfo, user_login, user_logout };
export default exports;