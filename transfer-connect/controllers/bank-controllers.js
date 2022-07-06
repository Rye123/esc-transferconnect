const moment = require('moment');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Transfer = require("../models/transfer");

let DUMMY_TRANSFERS = [
    {
        tid: "exampleid",
        username: "asdf",
        membership: "1005485",
        transfer: 100
    }
]

const getTransferById = async (req, res, next) => {
    const transferId = req.params.tid;

    let transfer;
    try {
        transfer = await Transfer.findById(transferId);
    } catch (err) {
        return next( new HttpError('Something went wrong, could not find requested transfer.', 500) );
    }
    // const transfer = DUMMY_TRANSFERS.find(t => {
    //     return t.tid === transferId;
    // });

    if (!transfer) {
        //return error
        return next( new HttpError('Could not find a transfer for the provided id', 404) );
    }

    res.json({ transfer: transfer.toObject({ getters: true }) });
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
        partnerCode
    })

    try {
        await createdTransfer.save();
    } catch (err) {
        return next( new HttpError('Creating place failed, please try again.', 500) );
    }

    // DUMMY_TRANSFERS.push(createdTransfer);

    res.status(201).json({transfer: createdTransfer});
}

/* Helper function for isLPIDValid */
function isNum(val){
    return !isNaN(val)
}

/* Helper function for isLPIDValid */
const isAlpha = str => /^[a-zA-Z]*$/.test(str);

/* helper function takes in program id and loyalty points id and returns validity of loyalty points id given program id */
const isLPIDValid = (pid,lpid) => {
    var valid_lengths = {
        'GOPOINTS': [10, 16],
        'INDOMILES': [10],
        'EMINENTGUEST': [12],
        'QFLYER': [10],
        'CONRADCLUB': [9],
        'MILLENIUMREWARDS': [10]
    };

    let result;
    if (pid == 'GOPOINTS' || pid == 'INDOMILES' || pid == 'EMINENTGUEST' || pid == 'QFLYER' || pid == 'CONRADCLUB') {
        if (valid_lengths[pid].includes(lpid.length) && isNum(lpid)){
            result = true;
        } else {
            result = false;
        }
    } else if (pid == 'MILLENIUMREWARDS') {
        if (valid_lengths[pid].includes(lpid.length) && isNum(lpid.slice(0,9)) && isAlpha(lpid[9])) {
            result = true;
        } else {
            result = false;
        }
    }  else { //case where invalid pid is given
        result = null 
    }
    return result
}

const getLPIDValidation = (req, res, next) => {
    const pid = req.params.pid;
    const lpid = req.params.lpid;

    const result = isLPIDValid(pid,lpid);
    
    res.status(200).json({result});
}

exports.getTransferById = getTransferById;
exports.createTransfer = createTransfer;
exports.getLPIDValidation = getLPIDValidation;