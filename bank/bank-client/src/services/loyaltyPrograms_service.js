/*
    auth_service.js
    Handles getting program data from the server
*/

/* Imports */
import axios from 'axios';
import Utils from '../utils/utils';
import LoyaltyProgram from '../classes/LoyaltyProgram';
import LoyaltyProgramMembership from '../classes/LoyaltyProgramMembership';

/* Constants */
// temporary storage
const loyaltyPrograms = [];
loyaltyPrograms.push(new LoyaltyProgram("2341", "Asia Miles", 400 / 250, "Asia Miles", 400, undefined, "Asia Miles description", undefined, undefined, undefined))
loyaltyPrograms.push(new LoyaltyProgram("1234", "British Airways", 400 / 312.5, "British Airways Miles", 500, undefined, "British Airways description", undefined, undefined, undefined))
loyaltyPrograms.push(new LoyaltyProgram("2458", "Dynasty Flyer", 400 / 250, "Dynasty Flyer Miles", 100, undefined, "Dynasty Flyer description", undefined, undefined, undefined))
loyaltyPrograms.push(new LoyaltyProgram("6432", "Emirates Skywards", 400 / 250, "Emirates Skywards Miles", undefined, undefined, "Emirates Skywards description", undefined, undefined, undefined))

const memberships = [];
memberships.push(new LoyaltyProgramMembership("A1234", "xxyy", "2341"));
// future endpoints for program data
const SERVER_URI = "/api/";
const PROGRAMS_URI = SERVER_URI + "loyaltyPrograms";
const MEMBERSHIPS_URI = SERVER_URI + "loyaltyProgramMemberships";

/* Operations */
/**
 * Gets all the loyalty programs available.
 * @returns Promise. Resolves to give all the programs if success.
 */
const programs_getAllPrograms = async () => {
    return axios
    .get(PROGRAMS_URI)
    .then(response => {
        return response.data.map(data => 
            new LoyaltyProgram(
                data.loyaltyProgramId,
                data.loyaltyProgramName,
                data.exchangeRate,
                data.currencyName,
                data.minTransfer,
                data.processingTime,
                data.description,
                data.enrolmentLink,
                data.tncLink,
                data.imgSrc
            )
        );
    });
}

/**
 * Gets a loyalty program by its loyaltyProgramId.
 * @param {string} loyaltyProgramId 
 * @returns Promise. Resolves to give a specific program if successful.
 */
const programs_getProgramById = async (loyaltyProgramId) => {
    return axios
    .get(`${PROGRAMS_URI}?loyaltyProgramId=${loyaltyProgramId}`)
    .then(response => {
        return new LoyaltyProgram(
            response.data.loyaltyProgramId,
            response.data.loyaltyProgramName,
            response.data.exchangeRate,
            response.data.currencyName,
            response.data.minTransfers,
            response.data.processingTime,
            response.data.description,
            response.data.enrolmentLink,
            response.data.tncLink,
            response.data.imgSrc
        );
    })
}

/**
 * Gets a loyalty program membership for the current user, given the loyaltyProgramId
 * @param {string} loyaltyProgramId 
 * @returns Promise. Resolves to give the membership if successful.
 */
const programs_getMembershipForProgram = async (loyaltyProgramId) => {
    return axios
    .get(`${MEMBERSHIPS_URI}?loyaltyProgramId=${loyaltyProgramId}`, {withCredentials: true})
    .then(response => {
        return new LoyaltyProgramMembership(
            response.data.loyaltyProgramMembershipId,
            response.data.userId,
            response.data.loyaltyProgramId
        )
    });
}

/**
 * Creates a new membership for the given program and user.
 * @param {string} loyaltyProgramId 
 * @param {string} membershipId 
 * @returns Promise. Resolves to give the membership if successful.
 */
const programs_postMembershipForProgram = async (loyaltyProgramId, membershipId) => {
    // TODO: Submit credentials in cookie when sending to server
    const loyaltyProgram = loyaltyPrograms.find(loyaltyProgram => loyaltyProgram.loyaltyProgramId === loyaltyProgramId);
    if (Utils.isEmptyObject(loyaltyProgram)) {
        return Promise.reject({ "error": "Loyalty Program doesn't exist" });
    }
    // ensure membership doesn't already exist
    const existingMembership = memberships.find(membership => membership.loyaltyProgramId === loyaltyProgramId);
    if (!Utils.isEmptyObject(existingMembership)) {
        return Promise.reject({ "error": "Membership already exists" });
    }
    // TODO: validate membershipId
    // temp details
    const userId = "xxyy";
    const membership = new LoyaltyProgramMembership(membershipId, userId, loyaltyProgramId);
    memberships.push(membership);
    return Promise.resolve(membership);
}

/**
 * Updates an existing membership for the given program and user.
 * @param {string} loyaltyProgramId 
 * @param {string} membershipId 
 * @returns Promise. Resolves to give the membership if successful.
 */
const programs_updateMembershipForProgram = async (loyaltyProgramId, newMembershipId) => {
    // TODO: Submit credentials in cookie when sending to server
    const loyaltyProgram = loyaltyPrograms.find(loyaltyProgram => loyaltyProgram.loyaltyProgramId === loyaltyProgramId);
    if (Utils.isEmptyObject(loyaltyProgram)) {
        return Promise.reject({ "error": "Loyalty Program doesn't exist" });
    }
    // TODO: validate membershipId
    // temp details
    const userId = "xxyy";
    const membership = memberships.find(membership => membership.loyaltyProgramId === loyaltyProgramId);
    if (Utils.isEmptyObject(membership)) {
        return Promise.reject({ "error": "Membership doesn't exist" });
    }
    if (membership.loyaltyProgramMembershipId === newMembershipId) {
        return Promise.reject({ "error": "No change in membershipId" })
    }
    membership.loyaltyProgramMembershipId = newMembershipId;
    return Promise.resolve(membership);
}

const exports = { programs_getAllPrograms, programs_getProgramById, programs_getMembershipForProgram, programs_postMembershipForProgram, programs_updateMembershipForProgram }
export default exports;