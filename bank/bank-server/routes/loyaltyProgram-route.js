/* REST Endpoints for Loyalty Programs and Memberships */

/* Express */
const express = require('express');
const router = express.Router();

/* Services */
const auth_user_service = require('../services/auth_user_service');
const tc_service = require('../services/tc_service');

/* Models */
const LoyaltyProgramModel = require('../models/LoyaltyProgram');
const LoyaltyProgramMembershipModel = require('../models/LoyaltyProgramMembership');

/* Errors */
const DataAccessError = require('../errors/DataAccessError');
class InvalidMembershipError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

/**
 * Route serving loyalty program requests
 * - If `loyaltyProgramId` is provided as search query, returns a single loyaltyProgram with the same loyaltyProgramId
 * - Otherwise, returns all loyalty programs available.
 */
router.get('/loyaltyPrograms', (request, response, next) => {
    const loyaltyProgramId = request.query["loyaltyProgramId"];
    if (typeof loyaltyProgramId === 'undefined') {
        // get all programs
        LoyaltyProgramModel.find({})
            .then(loyaltyPrograms => {
                if (loyaltyPrograms.length === 0)
                    return response.status(200).json([]);
                return response.status(200).json(loyaltyPrograms.map(program => program.toObject()));
            })
            .catch(err => {
                return next(new DataAccessError(err));
            });
    } else {
        // get all programs
        LoyaltyProgramModel.findOne({ loyaltyProgramId: loyaltyProgramId })
            .then(loyaltyProgram => {
                if (loyaltyProgram == null)
                    throw new DataAccessError();
                return response.status(200).json(loyaltyProgram.toObject());
            })
            .catch(err => {
                return next(err);
            });
    }
});

/**
 * Route serving loyalty program membership get requests
 * - If `loyaltyProgramId` is provided as search query, returns a single loyaltyProgramMembership corresponding to the currently authenticated user.
 * - Otherwise, returns all memberships under the user.
 */
router.get('/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.query["loyaltyProgramId"];
    const userId = request.user.userId;
    if (typeof loyaltyProgramId === 'undefined') {
        // get all memberships of the user
        LoyaltyProgramMembershipModel.find({ userId: userId })
            .then(memberships => {
                if (memberships.length === 0)
                    return response.status(200).json([]);
                response.status(200).json(memberships.map(membership => membership.toObject()));
            })
            .catch(err => {
                return next(new DataAccessError(err));
            })
    } else {
        // ensure loyalty program exists, then continue
        LoyaltyProgramModel.findOne({ loyaltyProgramId: loyaltyProgramId })
            .then(loyaltyProgram => {
                if (loyaltyProgram == null)
                    throw new DataAccessError();
                return LoyaltyProgramMembershipModel.findOne({ userId: userId, loyaltyProgramId: loyaltyProgramId });
            })
            .then(membership => {
                if (membership == null)
                    throw new DataAccessError();
                return response.status(200).json(membership.toObject());
            })
            .catch(err => {
                return next(new DataAccessError(err));
            })
    }
});

/**
 * Route serving loyalty program membership creation.
 */
router.post('/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.body.loyaltyProgramId;
    const loyaltyProgramMembershipId = request.body.loyaltyProgramMembershipId;
    const userId = request.user.userId;
    const membershipIds = request.user.loyaltyProgramMembershipIds;
    // ensure loyaltyProgram exists
    LoyaltyProgramModel.findOne({ loyaltyProgramId: loyaltyProgramId })
        .then(loyaltyProgram => {
            if (loyaltyProgram == null)
                throw new DataAccessError("loyalty program does not exist");
            return LoyaltyProgramMembershipModel.findOne({ userId: userId, loyaltyProgramId: loyaltyProgramId })
        })
        .then(membership => {
            if (!(membership == null))
                throw new InvalidMembershipError();

            // validate membershipId
            const validationRegex = /^[a-zA-Z\d]+$/m;
            const validMembershipId = loyaltyProgramMembershipId.match(validationRegex);
            if (validMembershipId == null)
                throw new InvalidMembershipError();
            return tc_service.isValidMembership(loyaltyProgramId, loyaltyProgramMembershipId)
        })
        .then(membershipIsValid => {
            if(!membershipIsValid)
                throw new InvalidMembershipError();
            // then create a new membership
            const newMembership = new LoyaltyProgramMembershipModel({
                loyaltyProgramMembershipId: loyaltyProgramMembershipId,
                userId: userId,
                loyaltyProgramId: loyaltyProgramId
            });
            return newMembership.save();
        })
        .then(savedMembership => {
            return response.json(savedMembership.toObject());
        })
        .catch(err => {
            return next(err);
        })
});

/**
 * Route serving loyalty program membership updates
 */
router.put('/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.body.loyaltyProgramId;
    const newLoyaltyProgramMembershipId = request.body.loyaltyProgramMembershipId;
    const userId = request.user.userId;
    let oldMembership = null;

    LoyaltyProgramMembershipModel.findOne({ userId: userId, loyaltyProgramId: loyaltyProgramId })
        .then(membership => {
            if (membership == null)
                throw new InvalidMembershipError();
            
            // validate membershipId
            const validationRegex = /^[a-zA-Z\d]+$/m;
            const validMembershipId = newLoyaltyProgramMembershipId.match(validationRegex);
            if (validMembershipId == null)
                throw new InvalidMembershipError();
            oldMembership = membership.toObject();
            return tc_service.isValidMembership(loyaltyProgramId, newLoyaltyProgramMembershipId);
        })
        .then(membershipIsValid => {
            if (!membershipIsValid)
                throw new InvalidMembershipError();
            // then update the membership
            const newMembershipObj = {
                ...oldMembership,
                loyaltyProgramMembershipId: newLoyaltyProgramMembershipId
            };
            return LoyaltyProgramMembershipModel.findOneAndUpdate({ userId: userId, loyaltyProgramId: loyaltyProgramId }, newMembershipObj, {
                new: true,
                runValidators: true,
                context: 'query'
            });
        })
        .then(updatedMembership => {
            return response.json(updatedMembership.toObject());
        })
        .catch(err => {
            return next(err);
        })
});

module.exports = router;