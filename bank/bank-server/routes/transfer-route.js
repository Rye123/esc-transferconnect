/* REST Endpoints for Transfers */

/* Express */
const express = require('express');
const router = express.Router();

/* Services */
const auth_user_service = require('../services/auth_user_service');

/* Models */
const TransferModel = require('../models/Transfer');
const UserModel = require('../models/User');

/* Errors */
const DataAccessError = require('../errors/DataAccessError');

/**
 * Route serving transfer get requests
 * - If `transferId` is provided as search query, returns the transfer that matches the transferId if the currently authenticated user is authorised to access it.
 * - Otherwise, returns all transfers that the currently authenticated user is authorised to access.
 */
router.get('/transfers', auth_user_service.requireAuthentication, (request, response, next) => {
    const transferId = request.query["transferId"];
    const userId = request.user.userId;
    // get corresponding memberships
    if (typeof transferId === 'undefined') {
        // get all transfers of user
        TransferModel.find({userId: userId})
        .then(transfers => {
            if (transfers.length === 0)
                return response.status(200).json([]);
            return response.status(200).json(transfers.map(transfer => transfer.toObject()));
        })
        .catch(err => {
            return next(new DataAccessError(err));
        });
    } else {
        // get single transfer
        TransferModel.findById(transferId)
        .then(transfer => {
            if (transfer == null)
                return next(new DataAccessError());
            if (transfer.userId !== userId)
                return next(new DataAccessError("Unauthorised access"));
            return response.status(200).json(transfer.toObject());
        })
        .catch(err => {
            return next(new DataAccessError(err));
        });
    }
})

router.post('/transfers', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.body.loyaltyProgramId;
    const loyaltyProgramMembershipId = request.body.loyaltyProgramMembershipId;
    let usedPoints = parseInt(request.body.points);
    const user = request.user;
    if (
        typeof loyaltyProgramId === 'undefined' ||
        typeof loyaltyProgramMembershipId === 'undefined' ||
        typeof usedPoints === 'undefined'
    )
        throw new Error("empty query string");
    
    if (!Number.isInteger(usedPoints))
        throw new Error("invalid points attribute")
    
    const updatedUserObj = {
        ...user,
        points: user.points - usedPoints
    }
    
    // ensure user's points don't drop below 0
    if (updatedUserObj.points < 0)
        throw new Error("not enough points")
    //TODO: ensure used points above minimum amt
    //TODO: check if membershipId and loyaltyProgramId are valid

    // Modify points, then make the transfer
    UserModel.findByIdAndUpdate(user.userId, updatedUserObj, {
        new: true,
        runValidators: true,
        context: 'query'
    })
    .then(updatedUser => {
        const newTransfer = new TransferModel({
            loyaltyProgramId: loyaltyProgramId,
            loyaltyProgramMembershipId: loyaltyProgramMembershipId,
            status: "pending",
            statusMessage: "",
            submissionDate: new Date(),
            points: usedPoints,
            userId: user.userId
        })
        return newTransfer.save();
    })
    .then(newTransfer => {
        return response.json(newTransfer.toObject());
    })
    .catch(err => {
        return next(err);
    })

});

module.exports = router;