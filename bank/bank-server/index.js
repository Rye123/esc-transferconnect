/* Environment Variables 
    Defined in a `.env` file in the same directory of this file, like this: VARIABLE_NAME=...
    These variables are accessible in Node with process.env.VARIABLE_NAME.
*/
require('dotenv').config(); 

/* Module Imports */
const express = require('express');
const morgan = require('morgan'); // Logging middleware: https://expressjs.com/en/resources/middleware/morgan.html

/* Express Setup */
const app = express();
const PORT = process.env.PORT || 3001;
const APP_NAME = "Bank Server";

/* Webpage Routing */
app.use('/', express.static(__dirname + '/build')); // /build will contain the static front-end, that can be built with React's `npm run build` command.

/* Routing for REST API */
app.use(express.json()); // any further requests will be stored in JSON in request.body
app.use(morgan('dev'));  // logs requests

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