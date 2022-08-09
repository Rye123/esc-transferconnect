/* REST Endpoints for Transfers */

/* Express */
const express = require('express');
const router = express.Router();

/* Services */
const auth_user_service = require('../services/auth_user_service');
const user_notify_service = require('../services/user_notify_service');
const tc_service = require('../services/tc_service');

/* Models */
const TransferModel = require('../models/Transfer');
const UserModel = require('../models/User');

/* Errors */
const DataAccessError = require('../errors/DataAccessError');
const ExternalAuthenticationError = require('../errors/ExternalAuthenticationError');
const InvalidTransferError = require('../errors/InvalidTransferError');

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
        TransferModel.find({ userId: userId })
            .then(transfers => {
                if (transfers == null || transfers.length === 0)
                    return response.status(200).json([]);
                return response.status(200).json(transfers.map(transfer => transfer.toObject()));
            })
            .catch(err => {
                return err;
            });
    } else {
        // get single transfer
        TransferModel.findById(transferId)
            .then(transfer => {
                if (transfer == null)
                    throw new DataAccessError();
                if (transfer.userId !== userId)
                    throw new DataAccessError("Unauthorised access");
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
                userId: user.userId,
                sentToTC: true
            })
            return newTransfer.save();
        })
        .then(async (newTransfer) => {
            const createdTransfer = newTransfer.toObject();
            response.json(createdTransfer);

            // send to TC
            return tc_service.sendTransfer(createdTransfer);
        })
        .then(() => {
            console.log("Transfer sent to TC");
        })
        .catch(err => {
            return next(err);
        })

});

router.post('/tc/updateTransferStatus', (request, response, next) => {
    const webhook_auth = request.get("Authorization");
    const transferId = request.body?.transferId || "";
    let transferStatus = request.body?.transferStatus || "";
    let transferStatusMessage = request.query?.transferStatusMessage || "Unknown error.";

    const possibleStatuses = ["completed", "processing", "error"];

    // Authentication Check
    if (webhook_auth !== `Bearer ${process.env.TC_WEBHOOK_AUTH}`)
        return next(new ExternalAuthenticationError());
    // Input Checks
    if (transferId === "" || !possibleStatuses.includes(transferStatus))
        return next(new InvalidTransferError());

    // map transfer status of TC to bank's
    switch (transferStatus) {
        case "completed":
            transferStatus = "fulfilled";
            break;
        case "processing":
            transferStatus = "pending";
            break;
        case "error":
            transferStatus = "error";
            if (transferStatusMessage === "")
                transferStatusMessage = "Unknown Error.";
            break;
    }
    let newTransfer = undefined;
    TransferModel.findById(transferId)
        .then(transfer => {
            if (transfer == null)
                throw new DataAccessError();
            const newTransferObj = {
                ...(transfer.toObject()),
                status: transferStatus,
                statusMessage: transferStatusMessage || ""
            }
            return TransferModel.findByIdAndUpdate(transferId, newTransferObj, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        })
        .catch(err => {
            return next(err);
        })
        .then(updatedTransfer => {
            newTransfer = updatedTransfer;
            return UserModel.findById(updatedTransfer.userId)
        })
        .then(user => {
            return user_notify_service.notifyUserOfCompletedTransfer(user, newTransfer.toObject());
        })
        .then(resp => {
            if (resp === false)
                console.log("User not notified");
            else
                console.log("Email sent.");
            return response.status(200).end();
        })
        .catch(e => {
            return next(e);
        })
})

module.exports = router;