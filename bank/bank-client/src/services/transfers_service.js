/*
    transfer_service.js
    Handles accrual transfer data with the bank server
*/

/* Imports */
import axios from 'axios';
import Utils from '../utils/utils';

/* Classes */
import Transfer from '../classes/Transfer';

/* Constants */
const transfers = [];
// future endpoints for transfer data
const SERVER_URI = "/api/";
const TRANSFERS_URI = SERVER_URI + "transfers";

/* Operations */

const transfer_getAllTransfers = async () => {
    return axios.get(TRANSFERS_URI, {withCredentials: true})
    .then(response => {
        return response.data.map(data =>
            new Transfer(
                data.transferId,
                data.loyaltyProgramId,
                data.loyaltyProgramMembershipId,
                data.status,
                data.statusMessage,
                data.submissionDate,
                data.points
            )
        );
    })
}

const transfer_getTransferById = async (transferId) => {
    return axios
    .get(TRANSFERS_URI, {params: {transferId}})
    .then(response => {
        return new Transfer(
            response.data.transferId,
            response.data.loyaltyProgramId,
            response.data.loyaltyProgramMembershipId,
            response.data.status,
            response.data.statusMessage,
            response.data.submissionDate,
            response.data.points
        )
    })
}

const transfer_postTransfer = async (loyaltyProgramId, loyaltyProgramMembershipId, points) => {
    return axios
    .post(TRANSFERS_URI, {loyaltyProgramId, loyaltyProgramMembershipId, points}, {withCredentials: true})
    .then(response => {
        return new Transfer(
            response.data.transferId,
            response.data.loyaltyProgramId,
            response.data.loyaltyProgramMembershipId,
            response.data.status,
            response.data.statusMessage,
            response.data.submissionDate,
            response.data.points
        )
    })
}

const exports = { transfer_getAllTransfers, transfer_getTransferById, transfer_postTransfer };
export default exports;