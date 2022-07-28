const moment = require('moment');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Loyalty = require('../models/loyalty');

const getLoyaltyByProgramId = async (req, res, next) => {
    const programId = req.params.pid;

    let loyalty, query;
    try {
        if (programId === "all") {
            query = {}
        } else {
            query = {programId};
        }
        console.log(programId);
        loyalty = await Loyalty.find(query);
        // loyalty = await Loyalty.findById(programId);
        // console.log(Boolean(loyaltyInfo));
    } catch (err) {
        return next(new HttpError("Cannot find loyalty program",500));
    }
    if (loyalty.length === 0) {
        //return error
        return next( new HttpError('Could not find Loyalty Info for the provided id', 404) );
    }
    res.json({loyalty});
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
    
    if (result === true){
        res.status(200).json({result});
    } else if (result === false) {
        return next(new HttpError("Member ID does not have the right format",404));
    } else if (result === null) {
        return next(new HttpError("Program ID not found", 404));
    }
}

exports.getLoyaltyByProgramId = getLoyaltyByProgramId;
exports.getLPIDValidation = getLPIDValidation;