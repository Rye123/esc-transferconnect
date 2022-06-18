/*
    users-handler.js
    Handles interaction with the users database
*/

import axios from 'axios';

/* Constants */
const DB_URI = "http://localhost:3001/api/users";
const AUTH_URI = "http://localhost:3001/api/token-auth"

/* Operations */

/**
 * 
 * @param {Object} user
 * @returns Promise that resolves to give the POST request response
 */
const create_new_user = async(user) => {
    if (!user.username || !user.password)
        return Promise.reject({ "error": "No username or password attribute provided" });
    return axios.post(DB_URI, user)
}

/**
 * 
 * @param {Object} user 
 * @returns Promise that resolves to give the assigned token if login was successful
 */
const authenticate = async(user) => {
    if (!user.username || !user.password)
        return Promise.reject({ "error": "No username or password attribute provided" });
    return axios.post(AUTH_URI, user, { withCredentials: true });
}

// DEBUG
const DEBUG_getUsers = async() => {
    return axios.get(DB_URI, { withCredentials: true });
}

const exports = { create_new_user, authenticate, DEBUG_getUsers };

export default exports;