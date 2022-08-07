/* REST Endpoints for User Authentication */

/* Express */
const express = require('express');
const router = express.Router();

/* Services */
const auth_user_service = require('../services/auth_user_service');

/* Models */
const UserModel = require('../models/User');
const user_notify_service = require('../services/user_notify_service');

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

router.post('/user-settings', auth_user_service.requireAuthentication, (request, response) => {
    const newSettings = {
        email: request.body.email || null,
        phoneNumber: parseInt(request.body.phoneNumber) || null,
        pushNotifSub: request.body.pushNotifSub || null,
        sendTo: {
            email: request.body.sendTo?.email || false,
            phoneNumber: request.body.sendTo?.phoneNumber || false,
            pushNotif: request.body.sendTo?.pushNotif || false
        }
    };
    // TODO: validation

    // Give notif if user requested notifications
    if (newSettings.pushNotifSub !== null) {
        user_notify_service.subscribePushNotifs(newSettings.pushNotifSub);
    }

    // Create new user
    const user = request.user;
    const newUser = {
        ...user,
        userSettings: newSettings
    };

    /* Update the relevant user */
    UserModel.findByIdAndUpdate(user.userId, newUser)
    .then(() => {
        return response.status(200).end();
    })
})

module.exports = router;
