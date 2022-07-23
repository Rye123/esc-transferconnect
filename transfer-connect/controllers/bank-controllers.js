const moment = require('moment');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Transfer = require("../models/transfer");

const getTransferById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {referenceNumber, partnerCode} = req.body;
    console.log(referenceNumber);
    let transfer = {};
    try {
        transfer = await Transfer.find({referenceNumber: referenceNumber, partnerCode: partnerCode});
    } catch (err) {
        return next( new HttpError('Something went wrong, could not find requested transfer.', 500) );
    }
    if (!transfer || transfer.length !== 1) {
        //return error
        return next( new HttpError('Could not find a transfer for the provided id or partner code', 404) );
    }

    res.status(200).json({status: transfer[0].status});
}

const createTransfer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    
    const {memberId, memberFirstName, memberLastName, amount, referenceNumber, partnerCode} = req.body;
    
    const createdTransfer = new Transfer({
        memberId,
        memberFirstName,
        memberLastName,
        transferDate: moment().toISOString(),
        amount,
        referenceNumber,
        partnerCode,
        status: "processing"
    })

    try {
        await createdTransfer.save();
    } catch (err) {
        return next( new HttpError('Creating Transfer failed, please try again.', 500) );
    }

    // DUMMY_TRANSFERS.push(createdTransfer);

    res.status(201).json({result: "Successfully created transfer"});
}

exports.getTransferById = getTransferById;
exports.createTransfer = createTransfer;