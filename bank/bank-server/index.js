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

/* Routes */
const userAuthRoute = require('./routes/user-auth-route');
const loyaltyProgramRoute = require('./routes/loyaltyProgram-route');
const transferRoute = require('./routes/transfer-route');

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

app.use('/api', userAuthRoute); // User Authentication Routes
app.use('/api', loyaltyProgramRoute); // Loyalty Program and Membership Routes
app.use('/api', transferRoute); // Transfer Route

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