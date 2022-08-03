const moment = require('moment');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Transfer = require("../models/transfer");

const getTransferByRef = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {referenceNumber, partnerCode} = req.body;
    console.log(referenceNumber);
    let transfer = {};
    let projection = { "_id": 0, referenceNumber: 1, status: 1, };
    try {
        if (referenceNumber === "all") {
            query = {partnerCode: partnerCode}
        } else {
            query = {referenceNumber: referenceNumber, partnerCode: partnerCode}
        }
        transfer = await Transfer.find(query, projection);
    } catch (err) {
        return next( new HttpError('Something went wrong, could not find requested transfer.', 500) );
    }
    if (!transfer || transfer.length === 0) {
        //return error
        return next( new HttpError('Could not find a transfer for the provided id or partner code', 404) );
    }

    res.status(200).json({transfer});
}

const createTransfer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    
    const {memberId, memberFirstName, memberLastName, amount, referenceNumber, partnerCode, loyaltyProgram} = req.body;
    
    const createdTransfer = new Transfer({
        memberId,
        memberFirstName,
        memberLastName,
        transferDate: moment().toISOString(),
        amount,
        referenceNumber,
        partnerCode,
        loyaltyProgram,
        status: "processing",
        outcomeDetails: "TBC",
        sentToSFTP: "false"
    })

    try {
        await createdTransfer.save();
    } catch (err) {
        return next( new HttpError('Creating Transfer failed, please try again.', 500) );
    }

    // DUMMY_TRANSFERS.push(createdTransfer);

    res.status(201).json({result: "Successfully created transfer"});
}

exports.getTransferByRef = getTransferByRef;
exports.createTransfer = createTransfer;