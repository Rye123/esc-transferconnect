const moment = require('moment');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Loyalty = require('../models/loyalty');

const getLoyaltyByProgramId = async (req, res, next) => {
    const programId = req.params.pid;

    let loyalty;
    try {
        console.log(programId);
        loyalty = await Loyalty.find({programId: programId});
        // loyalty = await Loyalty.findById(programId);
        // console.log(Boolean(loyaltyInfo));
    } catch {
        return next(new HttpError("Cannot find loyalty program",500));
    }
    if (!loyalty) {
        //return error
        return next( new HttpError('Could not find Loyalty Info for the provided id', 404) );
    }
    res.json({loyalty});
}

exports.getLoyaltyByProgramId = getLoyaltyByProgramId;