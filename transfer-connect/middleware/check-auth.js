const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_TC);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
  // need to verify userId with bank details in mongoDB
};
