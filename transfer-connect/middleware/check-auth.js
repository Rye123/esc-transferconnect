const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Bank = require("../models/bank");

dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_TC);
    req.userData = { bankName: decodedToken.bankName };
    
    // need to verify userId with bank details in mongoDB
    let bank;
    bank = await Bank.find(req.userData);
    
    if (!bank){
      throw new Error('Authentication failed!');
    }

    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
  
};
