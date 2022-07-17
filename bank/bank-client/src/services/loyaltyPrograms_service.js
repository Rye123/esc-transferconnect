/*
    auth_service.js
    Handles getting program data from the server
*/

/* Imports */
import axios from 'axios';
import { resolvePath } from 'react-router-dom';
import Utils from '../utils/utils';
import LoyaltyProgram from '../classes/LoyaltyProgram';

/* Constants */
// temporary storage
const loyaltyPrograms = [];
loyaltyPrograms.push(new LoyaltyProgram("2341", "Asia Miles", 400/250, "asia_miles_info.html", "images/asia-miles.jpeg", 4*7, 400));
loyaltyPrograms.push(new LoyaltyProgram("1234", "British Airways", 400/312.5, "british_airway_info.html", "images/british-airways.jpeg", 4*8, 400));
loyaltyPrograms.push(new LoyaltyProgram("2468", "Dynasty Flyer", 400/250, "dynasty_flyer_info.html", "images/china-airlines.jpeg", 4*4, 400))
loyaltyPrograms.push(new LoyaltyProgram("6432", "Emirates Skywards", 400/250, "emirates_skywards_info.html", "images/emirates.png", 4*4, 400))
// future endpoints for program data
const SERVER_URI = "/api/";
const PROGRAMS_URI = SERVER_URI + "programs";

/* Operations */
/**
 * Gets all the loyalty programs available.
 * @returns Promise. Resolves to give all the programs if success.
 */
const programs_getAllPrograms = async() => {
    return Promise.resolve(loyaltyPrograms);
}

/**
 * Gets a loyalty program by its loyaltyProgramId.
 * @param {string} id 
 * @returns Promise. Resolves to give a specific program if successful.
 */
const programs_getProgramById = async(id) => {
    const loyaltyProgram = loyaltyPrograms.find(loyaltyProgram => loyaltyProgram.loyaltyProgramId === id);

    if (Utils.isEmptyObject(loyaltyProgram)) {
        return Promise.reject({ "error": "Loyalty Program doesn't exist"});
    }
    return Promise.resolve(loyaltyProgram);
}

const exports = { programs_getAllPrograms, programs_getProgramById }
export default exports;