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

/* Express Setup */
const app = express();
const PORT = process.env.PORT || 3001;
const APP_NAME = "Bank Server";

/* Allow all cross-origin requests -- this is TEMPORARY */
const cors = require('cors');
const CLIENT_URI = 'http://localhost:3000';
app.use(cors({
    origin: CLIENT_URI,
    credentials: true
}));

/* Cookie Parsing */
app.use(cookieParser()); // now any request with a cookie is sent automatically

/* Webpage Routing */
app.use('/', express.static(__dirname + '/build')); // /build will contain the static front-end, that can be built with React's `npm run build` command.

/* Routing for REST API */
app.use(express.json()); // any further requests will be stored in JSON in request.body
app.use(morgan('dev'));  // logs requests

// Temporary database
users = [
    {
        "id": "1",
        "username": "johndoe1",
        "password": "password",
        "points": 42
    },
    {
        "id": "2",
        "username": "michaelmyers123",
        "password": "halloween",
        "points": 69
    },
    {
        "id": "3",
        "username": "mrpotatohead",
        "password": "onetwothree",
        "points": 123
    },
    {
        "id": "4",
        "username": "asdf",
        "password": "fdsa",
        "points": 52
    }
]

/* REST Endpoints for User Authentication */
app.get('/api/users/:id', auth_user_service.requireAuthentication, (request, response) => {
    // check request.payload (from requireAuth) if user is authorised to view this
    if (request.params.id !== request.payload.id) // user is not AUTHORISED
        throw new UserAuthorisationError();

    // otherwise, we return the user's information other than the password
    const foundUser = users.find(user => user.id === request.params.id);
    if (!foundUser) // no such user
        throw new UserAuthenticationError();
    const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        points: foundUser.points
    };
    return response.status(200).json(userInfo);
});

/**
 * Route serving user token resolution.
 * If token is valid, returns the authenticated user's information.
 */
app.get('/api/token-resolve', auth_user_service.requireAuthentication, (request, response) => {
    let user_id = request.payload.id;
    const foundUser = users.find(user => user.id === user_id);
    if (!foundUser) // the token works, but the user doesn't exist.
        throw new UserAuthenticationError();
    const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        points: foundUser.points
    };
    return response.status(200).json(userInfo);
});

app.post('/api/token-terminate', auth_user_service.deauthenticateUser, (request, response) => {
    response.status(204).end();
});

app.post('/api/token-auth', auth_user_service.authenticateUser, (request, response) => {
    response.status(201).end();
});


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
                return response.status(error.status).json({ error: "forbidden" })
            });
        case "UserAuthorisationError":
            return auth_user_service.deauthenticateUser(request, response, () => {
                return response.status(error.status).json({ error: "forbidden" })
            });
    
        default:
            console.error(error);
            return response.status(500).json({ error: "internal server error" })
    }
});

/* Server Listen */
app.listen(PORT, () => {
    console.log(`${APP_NAME} running on port ${PORT}.`)
});