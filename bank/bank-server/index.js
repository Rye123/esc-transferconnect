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
const JWT_Auth = require('./services/JWT_Auth');

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

// DEBUG: get request for users -- should be deleted
app.get('/api/users', JWT_Auth.requireAuth, (request, response) => {
    response.json(users);
});

app.get('/api/users/:id', JWT_Auth.requireAuth, (request, response) => {
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

app.get('/api/token-resolve', JWT_Auth.requireAuth, (request, response) => {
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

// TODO: Refactor to move cookie handling to auth
app.post('/api/token-terminate', JWT_Auth.requireAuth, (request, response) => {
    response.clearCookie(
        JWT_Auth.cookie_name,
        { httpOnly: true, secure: true }
    ).status(204).send();
});

// TODO: Refactor to move cookie handling to auth
app.post('/api/token-auth', (request, response) => {
    if (!request.body.username || !request.body.password)
        throw new UserAuthenticationError();

    const testUser = {
        username: request.body.username,
        password: request.body.password
    };

    const foundUser = users.find(user => user.username === testUser.username && user.password === testUser.password);
    
    if (!foundUser) // the token works, but the user doesn't exist.
        throw new UserAuthenticationError();
    // Set a cookie on the client-side with the given cookie_name and the given token.
    const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        points: foundUser.points
    };
    response.cookie(
        JWT_Auth.cookie_name,
        JWT_Auth.generateToken({id: foundUser.id, username: foundUser.username}), 
        { httpOnly: true, secure: true }
    ).status(201).json(userInfo);
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
            //TODO: ideally we'll call a logout function to delete any cookies -- wait for auth refactor
            return response.status(error.status).json({ error: "authentication failed" })
        case "UserAuthorisationError":
            return response.status(error.status).json({ error: "forbidden" })
    
        default:
            console.error(error);
            return response.status(500).json({ error: "internal server error" })
    }
});

/* Server Listen */
app.listen(PORT, () => {
    console.log(`${APP_NAME} running on port ${PORT}.`)
});