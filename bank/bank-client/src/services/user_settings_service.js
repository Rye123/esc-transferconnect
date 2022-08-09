/*
    user_settings_service.js
    Handles modification of user settings with the bank server
*/

import axios from 'axios';

/* Constants */
const SERVER_URI = "/api";
const SETTINGS_URI = `${SERVER_URI}/user-settings`;

const user_postsettings = async(newSettings) => {
    return axios.post(SETTINGS_URI, newSettings, { withCredentials: true });
}

const exports = { user_postsettings };
export default exports;