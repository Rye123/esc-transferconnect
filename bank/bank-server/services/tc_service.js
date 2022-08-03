/**
 *  
 * Relies on the environment variables from `index.js`.
 */
const axios = require('axios');

/* Services */
const user_notify_service = require('./user_notify_service');

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
class NoUpdateException extends Error {
    // Exception to indicate no update necessary.
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

/* Programs */
const getAllPrograms = () => {
    return axios.get(`${TC_URI}/api/program/info/all`, TC_REQ_CONFIG)
        .then(response => {
            const updatedPrograms = response.data?.loyalty;
            // for each program, add it if its not there, else update
            const queriesList = [];
            updatedPrograms.map(program => {
                // Convert to a LoyaltyProgram class instance
                const loyaltyProgram = new LoyaltyProgramModel({
                    loyaltyProgramId: program.programId,
                    loyaltyProgramName: program.programName,
                    exchangeRate: 1,
                    currencyName: program.currencyName,
                    minTransfer: 0,
                    processingTime: program.processingTime,
                    description: program.description,
                    enrolmentLink: program.enrollmentLink,
                    tncLink: program.tncLink,
                    imgSrc: undefined
                });
                // update if it exists, otherwise add
                queriesList.push(
                    LoyaltyProgramModel.findOneAndReplace({ loyaltyProgramId: program.programId }, loyaltyProgram.toObject(), {
                        upsert: true, // insert new if doesn't exist
                    })
                );
            })
            return Promise.all(queriesList);
        })
        .then(() => {
            return;
        })
        .catch(err => {
            throw new TransferConnectError(err);
        })
}


/* Memberships */
const isValidMembership = async(programId, membershipId) => {
    return axios.get(`${TC_URI}/api/program/validate/${programId}/${membershipId}`, TC_REQ_CONFIG)
    .then(response => {
        return response.data?.result === true;
    })
    .catch(err => {
        return false;
    })
}


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
                loyaltyProgram: transfer.loyaltyProgramId,
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

/**
 * 
 * @param {Transfer} transfer Transfer Object
 * @returns 
 */
const updateTransfer = (transfer) => {
    const reqBody = {
        referenceNumber: transfer.transferId,
        partnerCode: TC_PARTNER_CODE
    };
    let updatedTransferObject = undefined;
    return axios.post(`${TC_URI}/api/bank/accrual-update`, reqBody, TC_REQ_CONFIG)
        .then(response => {
            const tc_transfer_status = response.data.transfer[0].status; // WHY. IS. THIS. SO. ENCAPSULATED???
            let new_status = "pending";
            if (typeof tc_transfer_status === 'undefined')
                throw new Error("Unknown TC error"); // TODO: fix
            switch (tc_transfer_status) {
                case "processing":
                    throw new NoUpdateException();
                    break;
                case "completed":
                    new_status = "fulfilled";
                    break;
                case "error":
                    new_status = "error";
                    break;
                default:
                    throw new Error(`Unknown transfer status from TC: ${status}`); // TODO: create TC-specific error 
            }
            const updatedTransfer = {
                ...transfer,
                status: new_status
            };
            return TransferModel.findByIdAndUpdate(transfer.transferId, updatedTransfer, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        })
        .then(transferUpdate => {
            updatedTransferObject = transferUpdate.toObject();
            return UserModel.findById(updatedTransferObject.userId);
        })
        .then(user => {
            return user_notify_service.notifyUserOfCompletedTransfer(user, updatedTransferObject);
        })
        .then(resp => {
            if (resp === false)
                console.log("User not notified");
            else
                console.log("Email sent.");
            return;
        })
        .catch(err => {
            if (err.name === "NoUpdateException")
                return;
            throw new TransferConnectError(err);
        })
}

module.exports = { isValidMembership, getAllPrograms, sendTransfer, updateTransfer };