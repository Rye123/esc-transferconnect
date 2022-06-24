/**
 * auth_user_service: Handler for authentication
 */
/* Module Imports */
const express = require('express');
const jwt = require('jsonwebtoken');

/* Error Logging */
const ApplicationError = require('../errors/ApplicationError');
const UserAuthenticationError = require('../errors/UserAuthenticationError');

/* Constants */
const AUTHENTICATION_MAX_AGE = 60 * 60 * 1000; // 1 hour, in milliseconds
const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

const auth_user_service = {
    /* Cookie Details for Security Token */
    cookie_token_name: "_bank_sess",
    cookie_token_options: {
        httpOnly: true,
        secure: true,
        maxAge: AUTHENTICATION_MAX_AGE // 1 hour in milliseconds
    },

    /* Cookie Details for User ID Cookie */
    cookie_userID_name: "bank_userid",
    cookie_userID_options: {
        maxAge: AUTHENTICATION_MAX_AGE // 1 hour in milliseconds
    },

    /**
     * Middleware that authenticates the user, with credentials given in request.body.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    authenticateUser (request, response, next) {
        if (!request.body) // JSON routing didn't work
            throw new ApplicationError(this.name, ": request.body not found.");
        if (!request.body.username || !request.body.password)
            throw new UserAuthenticationError(this.name, ": credentials not found.");
        
        /* Authenticate user */
        const credentials = {
            username: request.body.username,
            password: request.body.password
        };

        const foundUser = users.find(user => user.username === credentials.username && user.password === credentials.password);
        if (!foundUser)
            throw new UserAuthenticationError();
        
        /* Set cookies */
        // set token cookie
        const jwt_payload = {
            id: foundUser.id,
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
            foundUser.id,
            auth_user_service.cookie_userID_options
        );

        /* Call the next function */
        next();
    },

    /**
     * Middleware that requires authentication to proceed.
     * If user is not authenticated (i.e. doesn't have a token or has an invalid one), throws an appropriate error.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    requireAuthentication (request, response, next) {
        const token  = request.cookies[auth_user_service.cookie_token_name];
        const userID = request.cookies[auth_user_service.cookie_userID_name];

        if (token == null || userID == null) // token cookie or the userID cookie don't exist
            throw new UserAuthenticationError(this.name, ": token or userID doesn't exist.");
        
        /* Verify that the token is a valid token */
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, payload) => {
            if (error)
                throw new UserAuthenticationError(this.name, ": invalid token.");
    
            /* Verify that the token's userID matches the userID */
            if (userID !== payload.id)
                throw new UserAuthenticationError(this.name, ": token doesn't match userID");
            
            // here, token is verified. save it in the request params.
            request.payload = payload;
            next(); // call the next function
        });
    },

    /**
     * Middleware that deauthenticates a user before proceeding.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    deauthenticateUser (request, response, next) {
        response.clearCookie(auth_user_service.cookie_token_name, auth_user_service.cookie_token_options);
        response.clearCookie(auth_user_service.cookie_userID_name, auth_user_service.cookie_userID_options);
        next();
    }
}

module.exports = auth_user_service;