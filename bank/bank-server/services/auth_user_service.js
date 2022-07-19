/**
 * auth_user_service: Handler for authentication
 */
/* Module Imports */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/* Error Logging */
const ApplicationError = require('../errors/ApplicationError');
const UserAuthenticationError = require('../errors/UserAuthenticationError');

/* Models */
const UserModel = require('../models/User');

/* Constants */
const AUTHENTICATION_MAX_AGE = 60 * 60 * 1000; // 1 hour, in milliseconds
const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

const auth_user_service = {
    /* Cookie Details for Security Token */
    cookie_token_name: "_bank_sess",
    cookie_token_options: {
        httpOnly: true,
        secure: true,
        maxAge: AUTHENTICATION_MAX_AGE
    },

    /* Cookie Details for User ID Cookie */
    cookie_userID_name: "bank_userid",
    cookie_userID_options: {
        maxAge: AUTHENTICATION_MAX_AGE
    },

    /**
     * Middleware that authenticates the user, with credentials given in request.body.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    authenticateUser(request, response, next) {
        if (!request.body) // JSON routing didn't work
            throw new ApplicationError(this.name, ": request.body not found.");
        if (!request.body.username || !request.body.password)
            throw new UserAuthenticationError(this.name, ": credentials not found.");

        /* Authenticate user */
        const credentials = {
            username: request.body.username,
            password: request.body.password
        };

        /* Find the user in the database */
        let foundUser = {};
        UserModel.findOne({ username: credentials.username })
            .then(user => {
                if (!user)
                    throw new UserAuthenticationError(this.name, ": valid user not found.");
                foundUser = user.toObject();
                return bcrypt.compare(credentials.password, user.password);
            })
            .then(compareResult => {
                if (compareResult === false) {
                    throw new UserAuthenticationError(this.name, ": invalid password");
                }

                /* Set cookies */
                // set token cookie
                const jwt_payload = {
                    userId: foundUser.userId,
                    username: foundUser.username
                };
                const jwt_token = jwt.sign(jwt_payload, JWT_SECRET, { expiresIn: AUTHENTICATION_MAX_AGE });
                response.cookie(
                    auth_user_service.cookie_token_name,
                    jwt_token,
                    auth_user_service.cookie_token_options
                );
                // set user ID cookie
                response.cookie(
                    auth_user_service.cookie_userID_name,
                    foundUser.userId,
                    auth_user_service.cookie_userID_options
                );

                /* Call the next function */
                next();

            })
            .catch(error => {
                next(new UserAuthenticationError(error));
            });
    },

    /**
     * Middleware that requires authentication to proceed.
     * If user is not authenticated (i.e. doesn't have a token or has an invalid one), throws an appropriate error.
     * Otherwise, saves the relevant user in the request body as request.user
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    requireAuthentication(request, response, next) {
        const token = request.cookies[auth_user_service.cookie_token_name];
        const userId = request.cookies[auth_user_service.cookie_userID_name];

        /* Verify that the token is a valid token */
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, payload) => {
            if (error)
                throw new UserAuthenticationError(this.name, ": invalid token.");

            /* Verify that the token's userId matches the userID */
            if (userId !== payload.userId)
                throw new UserAuthenticationError(this.name, ": token doesn't match userID");

            /* Find the user in the database */
            UserModel.findById(userId)
                .select('-password')
                .then(foundUser => {
                    if (!foundUser)
                        throw new UserAuthenticationError();

                    // Save user details in request body
                    request.user = foundUser.toObject();

                    /* Call the next function */
                    next();

                })
                .catch(error => {
                    next(new UserAuthenticationError(error));
                });
        });
    },

    /**
     * Middleware that deauthenticates a user before proceeding.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    deauthenticateUser(request, response, next) {
        response.clearCookie(auth_user_service.cookie_token_name, auth_user_service.cookie_token_options);
        response.clearCookie(auth_user_service.cookie_userID_name, auth_user_service.cookie_userID_options);
        next();
    }
}

module.exports = auth_user_service;