/* Environment Variables 
    Defined in a `.env` file in the same directory of this file, like this: VARIABLE_NAME=...
    These variables are accessible in Node with process.env.VARIABLE_NAME.
*/
require('dotenv').config(); 

/* Module Imports */
const express = require('express');
const morgan = require('morgan'); // Logging middleware: https://expressjs.com/en/resources/middleware/morgan.html
const cookieParser = require('cookie-parser'); // middleware for cookies

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
        "id": 1,
        "username": "johndoe1",
        "password": "password",
        "points": 42
    },
    {
        "id": 2,
        "username": "michaelmyers123",
        "password": "halloween",
        "points": 69
    },
    {
        "id": 3,
        "username": "mrpotatohead",
        "password": "onetwothree",
        "points": 123
    },
    {
        "username": "asdf",
        "password": "fdsa",
        "id": 4
    }
]


/* JWT Authentication (TODO: move to another module) */
const jwt = require('jsonwebtoken');
const TOKEN_EXPIRY = '1800s'; // 30 minutes

const generateAuthToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: '1800s' });
}

const authenticateAuthToken = (request, response, next) => {
    // sets request.user to the auth token's user if it is verified
    // const authHeader = request.headers['authorization'];
    // const authToken = authHeader && authHeader.split(' ')[1]; // gives the authentication token if it exists
    const authToken = request.cookies['authToken'];

    if (authToken == null)
        return response.status(401).send({ error: 'authentication required' });
    
    jwt.verify(authToken, process.env.JWT_TOKEN_SECRET, (error, user) => {
        if (error)
            return response.status(403).send({ error: 'authentication failure' });
        request.user = user;
        next();
    })
}


// DEBUG: get request for users
app.get('/api/users', authenticateAuthToken, (request, response) => {
    response.json(users);
});

app.post('/api/token-auth', (request, response) => {
    if (!request.body.username || !request.body.password) {
        return response.status(400).json({ error: 'missing information' });
    }

    const testUser = {
        username: request.body.username,
        password: request.body.password
    };

    const foundUser = users.find(user => user.username === testUser.username && user.password === testUser.password);
    if (foundUser) {
        const token = generateAuthToken({username: foundUser.username})
        console.log(`Setting cookie with ${token}`)
        response.cookie("authToken", token, { httpOnly: true, secure: true }).status(201).send("Cookie Set");
        //return response.status(201).json(token);
    } else {
        return response.status(401).json({ error: 'authentication failed' })
    }
})


/* Unknown Endpoint Handling */
app.use((request, response) => {
    //TODO: Add 404 Not Found page
    response.status(404).send({ error: 'unknown endpoint' });
});

/* Request Error Handling */
app.use((error, request, response, next) => {
    console.error(error.message);

    return response.status(400).end();
});

/* Server Listen */
app.listen(PORT, () => {
    console.log(`${APP_NAME} running on port ${PORT}.`)
});