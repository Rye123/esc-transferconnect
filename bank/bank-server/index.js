/* Environment Variables 
    Defined in a `.env` file in the same directory of this file, like this: VARIABLE_NAME=...
    These variables are accessible in Node with process.env.VARIABLE_NAME.
*/
require('dotenv').config();

/* Module Imports */
const express = require('express');
const morgan = require('morgan'); // Logging middleware: https://expressjs.com/en/resources/middleware/morgan.html
const cookieParser = require('cookie-parser'); // middleware for cookies

/* Service Imports */
const auth_user_service = require('./services/auth_user_service');

/* Error Imports */
const ApplicationError = require('./errors/ApplicationError');
const UserAuthorisationError = require('./errors/UserAuthorisationError');
const UserAuthenticationError = require('./errors/UserAuthenticationError');
const DataAccessError = require('./errors/DataAccessError');

/* Express Setup */
const app = express();
const PORT = process.env.PORT || 3001;
const APP_NAME = "Bank Server";

/* Models */
const mongoose = require('mongoose');
const mongoDBurl = process.env.MONGODB_URI;
mongoose.set('debug', true);
mongoose.connect(mongoDBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(result => {
    console.log("Established connection to MongoDB.");
})
.catch(error => {
    console.error("Database Error: ", error);
});
const UserModel = require('./models/User');
const LoyaltyProgramModel = require('./models/LoyaltyProgram');
const LoyaltyProgramMembershipModel = require('./models/LoyaltyProgramMembership');
const TransferModel = require('./models/Transfer');

/* Cookie Parsing */
app.use(cookieParser()); // now any request with a cookie is sent automatically

/* Webpage Routing */
app.use('/', express.static(__dirname + '/build')); // /build will contain the static front-end, that can be built with React's `npm run build` command.

/* Routing for REST API */
app.use(express.json()); // any further requests will be stored in JSON in request.body
app.use(morgan('dev'));  // logs requests

/* REST Endpoints for User Authentication */

/**
 * Route serving user token resolution.
 * If token is valid, returns the authenticated user's information.
 */
app.get('/api/user-token-resolve', auth_user_service.requireAuthentication, (request, response) => {
    const foundUser = request.user; // attached from requireAuthentication: Any error there should be resolved already
    return response.status(200).json(foundUser);
});

app.post('/api/user-token-terminate', auth_user_service.deauthenticateUser, (request, response) => {
    response.status(204).end();
});

app.post('/api/user-token-auth', auth_user_service.authenticateUser, (request, response) => {
    response.status(201).end();
});

/**
 * Route serving loyalty program requests
 * - If `loyaltyProgramId` is provided as search query, returns a single loyaltyProgram with the same loyaltyProgramId
 * - Otherwise, returns all loyalty programs available.
 */
app.get('/api/loyaltyPrograms', (request, response, next) => {
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
        LoyaltyProgramModel.findOne({loyaltyProgramId: loyaltyProgramId})
        .then(loyaltyProgram => {
            if (loyaltyProgram == null)
                return next(new DataAccessError());
            return response.status(200).json(loyaltyProgram.toObject());
        })
        .catch(err => {
            return next(new DataAccessError(err));
        });
    }
});

/**
 * Route serving loyalty program membership get requests
 * - If `loyaltyProgramId` is provided as search query, returns a single loyaltyProgramMembership corresponding to the currently authenticated user.
 * - Otherwise, returns all memberships under the user.
 */
app.get('/api/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.query["loyaltyProgramId"];
    const userId = request.user.userId;
    if (typeof loyaltyProgramId === 'undefined') {
        // get all memberships of the user
        LoyaltyProgramMembershipModel.find({userId: userId})
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
        LoyaltyProgramModel.findOne({loyaltyProgramId: loyaltyProgramId})
        .then(loyaltyProgram => {
            if (loyaltyProgram == null)
                return next(new DataAccessError());
            return LoyaltyProgramMembershipModel.findOne({userId: userId, loyaltyProgramId: loyaltyProgramId});
        })
        .then(membership => {
            if (membership == null)
                return next(new DataAccessError());
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
app.post('/api/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.body.loyaltyProgramId;
    const loyaltyProgramMembershipId = request.body.loyaltyProgramMembershipId;
    const userId = request.user.userId;
    const membershipIds = request.user.loyaltyProgramMembershipIds;
    // ensure loyaltyProgram exists
    LoyaltyProgramModel.findOne({loyaltyProgramId: loyaltyProgramId})
    .then(loyaltyProgram => {
        if (loyaltyProgram == null)
            return next(new DataAccessError("loyalty program does not exist"))
        return LoyaltyProgramMembershipModel.findOne({userId: userId, loyaltyProgramId: loyaltyProgramId})
    })
    .then(membership => {
        if (!(membership == null))
            return next(new Error("membership already exists"));

        // validate membershipId
        const validationRegex = /^[a-zA-Z\d]+$/m;
        const validMembershipId = loyaltyProgramMembershipId.match(validationRegex);
        if (validMembershipId == null)
            return next(new Error("invalid membership"));

        // then update the user's list of memberships
        membershipIds.push(loyaltyProgramMembershipId)
        const updatedUser = {
            ...request.user,
            loyaltyProgramMembershipIds: membershipIds
        }
        return UserModel.findByIdAndUpdate(userId, updatedUser, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    })
    .then(updatedUser => {
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
 app.put('/api/loyaltyProgramMemberships', auth_user_service.requireAuthentication, (request, response, next) => {
    const loyaltyProgramId = request.body.loyaltyProgramId;
    const newLoyaltyProgramMembershipId = request.body.loyaltyProgramMembershipId;
    const userId = request.user.userId;
    const membershipIds = request.user.loyaltyProgramMembershipIds;
    let oldMembership = null;
    
    LoyaltyProgramMembershipModel.findOne({userId: userId, loyaltyProgramId: loyaltyProgramId})
    .then(membership => {
        if (membership == null)
            return next(new Error("membership does not exist"));

        // validate membershipId
        const validationRegex = /^[a-zA-Z\d]+$/m;
        const validMembershipId = newLoyaltyProgramMembershipId.match(validationRegex);
        if (validMembershipId == null)
            return next(new Error("invalid membership"));
        
        // then update the user's list of memberships
        membershipIds[membershipIds.indexOf(membership.loyaltyProgramMembershipId)] = newLoyaltyProgramMembershipId;
        const updatedUser = {
            ...request.user,
            loyaltyProgramMembershipIds: membershipIds
        }
        oldMembership = membership; // set here to update later
        return UserModel.findByIdAndUpdate(userId, updatedUser, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    })
    .then(updatedUser => {
        // then update the membership
        const newMembershipObj = {
            ...(oldMembership.toObject()),
            loyaltyProgramMembershipId: newLoyaltyProgramMembershipId
        };
        return LoyaltyProgramMembershipModel.findByIdAndUpdate(oldMembership.id, newMembershipObj, {
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

/**
 * Route serving transfer get requests
 * - If `transferId` is provided as search query, returns the transfer that matches the transferId if the currently authenticated user is authorised to access it.
 * - Otherwise, returns all transfers that the currently authenticated user is authorised to access.
 */
app.get('/api/transfers', auth_user_service.requireAuthentication, (request, response, next) => {
    const transferId = request.query["transferId"];
    const user = request.user;
    const membershipIds = user.loyaltyProgramMembershipIds;
    // get corresponding memberships
    if (typeof transferId === 'undefined') {
        // get all transfers of user
        const getTransfersForEachMembershipId_promises = [];
        membershipIds.forEach(membershipId => {
            getTransfersForEachMembershipId_promises.push(TransferModel.find({loyaltyProgramMembershipId: membershipId}))
        });
        Promise.all(getTransfersForEachMembershipId_promises)
        .then(transfers => {
            if (transfers.length === 0)
                return response.status(200).json([]);
            return response.status(200).json(transfers.flat().map(transfer => transfer.toObject()));
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
            if (!(membershipIds.includes(transfer.loyaltyProgramMembershipId)))
                return next(new DataAccessError("Unauthorised access"));
            return response.status(200).json(transfer.toObject());
        })
        .catch(err => {
            return next(new DataAccessError(err));
        });
    }
})

/* Unknown Endpoint Handling */
app.use((request, response) => {
    //TODO: Add 404 Not Found page
    response.status(404).send({ error: 'unknown endpoint' });
});

/* Request Error Handling */
app.use((error, request, response, next) => {
    switch (error.name) {
        case "UserAuthenticationError":
            return auth_user_service.deauthenticateUser(request, response, () => {
                return response.status(error.status).json({ error: "forbidden" });
            });
        case "UserAuthorisationError":
            return auth_user_service.deauthenticateUser(request, response, () => {
                return response.status(error.status).json({ error: "forbidden" });
            });
        case "DataAccessError":
            return response.status(error.status).json( {error: "not found"} );

        default:
            console.log(error);
            return response.status(500).json({ error: "internal server error" })
    }
});

/* Server Listen */
app.listen(PORT, () => {
    console.log(`${APP_NAME} running on port ${PORT}.`)
});