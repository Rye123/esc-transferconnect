const axios = require('axios');

/* Bank Models */
const UserModel = require('../models/User');
const LoyaltyProgramModel = require('../models/LoyaltyProgram');
const TransferModel = require('../models/Transfer');

/* TransferConnect */
const TC_URI = "http://localhost:3002";
const TC_KEY = process.env.TC_TOKEN_SECRET;
const TC_REQ_CONFIG = {
    headers: {
        Authorization: `Bearer ${TC_KEY}`
    }
};
const TC_PARTNER_CODE = "MSTB";

/* Errors */
const TransferConnectError = require('../errors/TransferConnectError');
const ApplicationError = require('../errors/ApplicationError');


/* Transfers */
/**
 * 
 * @param {Transfer} transfer 
 * @returns 
 */
const sendTransfer = async (transfer) => {
    return UserModel.findById(transfer.userId)
    .then(user => {
        const formattedTransfer = {
            memberId: transfer.loyaltyProgramMembershipId,
            memberFirstName: user.firstName,
            memberLastName: user.lastName,
            amount: transfer.points,
            referenceNumber: transfer.transferId,
            partnerCode: TC_PARTNER_CODE
        }
        return axios.post(`${TC_URI}/api/bank/accrual-req`, formattedTransfer, TC_REQ_CONFIG)
    })
    .then(() => {
        return;
    })
    .catch(async (err) => {
        // update transfer to NOT sent to TC
        const updatedTransfer = {
            ...transfer,
            sentToTC: false
        }
        try {
            await TransferModel.findByIdAndUpdate(transfer.transferId, updatedTransfer, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        } catch (err) {
            throw ApplicationError("Could not update TransferModel");
        }
        throw new TransferConnectError(err);
    });
}


module.exports = {sendTransfer};