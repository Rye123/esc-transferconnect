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
// temporary storage
const transfers = [];
for (let i = 1; i < 11; i++) {
    transfers.push(new Transfer((i*123).toString(), (i*432).toString(), (i*54).toString(), 'pending'))
}
// future endpoints for transfer data
const SERVER_URI = "/api/";
const PROGRAMS_URI = SERVER_URI + "transfers";

/* Operations */

const transfer_getAllTransfers = async() => {
    // TODO: the axios request will include credentials
    return Promise.resolve(transfers);
}

const transfer_getTransferById = async(id) => {
    const transfer = transfers.find(transfer => transfer.transferId === id);

    if (Utils.isEmptyObject(transfer)) {
        return Promise.reject({ "error": "Transfer doesn't exist."});
    }
    return Promise.resolve(transfer);
}

const exports = { transfer_getAllTransfers, transfer_getTransferById };
export default exports;