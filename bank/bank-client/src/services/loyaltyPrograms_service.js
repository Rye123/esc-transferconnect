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
        .get(PROGRAMS_URI, { params: { loyaltyProgramId } })
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
        .get(MEMBERSHIPS_URI, { params: { loyaltyProgramId }, withCredentials: true })
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
 * @param {string} loyaltyProgramMembershipId 
 * @returns Promise. Resolves to give the membership if successful.
 */
const programs_postMembershipForProgram = async (loyaltyProgramId, loyaltyProgramMembershipId) => {
    return axios
        .post(MEMBERSHIPS_URI, { loyaltyProgramId, loyaltyProgramMembershipId }, { withCredentials: true })
        .then(response => {
            return new LoyaltyProgramMembership(
                response.data.loyaltyProgramMembershipId,
                response.data.userId,
                response.data.loyaltyProgramId
            )
        })
}

/**
 * Updates an existing membership for the given program and user.
 * @param {string} loyaltyProgramId 
 * @param {string} loyaltyProgramMembershipId 
 * @returns Promise. Resolves to give the membership if successful.
 */
const programs_updateMembershipForProgram = async (loyaltyProgramId, loyaltyProgramMembershipId) => {
    return axios
        .put(MEMBERSHIPS_URI, { loyaltyProgramId, loyaltyProgramMembershipId }, { withCredentials: true })
        .then(response => {
            return new LoyaltyProgramMembership(
                response.data.loyaltyProgramMembershipId,
                response.data.userId,
                response.data.loyaltyProgramId
            )
        })
}

const exports = { programs_getAllPrograms, programs_getProgramById, programs_getMembershipForProgram, programs_postMembershipForProgram, programs_updateMembershipForProgram }
export default exports;