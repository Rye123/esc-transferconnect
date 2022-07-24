/* REST Endpoints for User Authentication */

/* Express */
const express = require('express');
const router = express.Router();

/* Services */
const auth_user_service = require('../services/auth_user_service');

/**
 * Route serving user token resolution.
 * If token is valid, returns the authenticated user's information.
 */
router.get('/user-token-resolve', auth_user_service.requireAuthentication, (request, response) => {
    const foundUser = request.user; // attached from requireAuthentication: Any error there should be resolved already
    return response.status(200).json(foundUser);
});

router.post('/user-token-terminate', auth_user_service.deauthenticateUser, (request, response) => {
    response.status(204).end();
});

router.post('/user-token-auth', auth_user_service.authenticateUser, (request, response) => {
    response.status(201).end();
});

module.exports = router;
